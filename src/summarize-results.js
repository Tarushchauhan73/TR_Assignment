#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const reportPath = process.argv[2] || 'playwright-report.json';
const outputPath = process.env.SUMMARY_OUTPUT || 'test-summary.txt';

function extractTests(report) {
  const tests = [];

  function addTest(result, title, annotations, retry) {
    tests.push({
      title,
      status: result.status || result.expectedStatus || 'unknown',
      duration: result.duration || 0,
      errors: result.errors || (result.error ? [result.error] : []),
      annotations: result.annotations || annotations || [],
      retry: typeof result.retry === 'number' ? result.retry : retry || 0,
      expectedStatus: result.expectedStatus
    });
  }

  function processSuite(suite, parentTitle = '') {
    const currentTitle = [parentTitle, suite.title].filter(Boolean).join(' > ');

    if (Array.isArray(suite.specs)) {
      suite.specs.forEach((spec) => {
        const specTitle = [currentTitle, spec.title].filter(Boolean).join(' > ');
        if (Array.isArray(spec.tests)) {
          spec.tests.forEach((test) => {
            const annotations = test.annotations || [];
            if (Array.isArray(test.results) && test.results.length) {
              test.results.forEach((result) => {
                addTest(result, specTitle, annotations, result.retry || 0);
              });
            } else {
              addTest(test, specTitle, annotations, test.retry || 0);
            }
          });
        }
      });
    }

    if (Array.isArray(suite.tests)) {
      suite.tests.forEach((test) => {
        const title = [currentTitle, test.title].filter(Boolean).join(' > ');
        if (Array.isArray(test.results) && test.results.length) {
          test.results.forEach((result) => {
            addTest(result, title, test.annotations || [], result.retry || 0);
          });
        } else {
          addTest(test, title, test.annotations || [], test.retry || 0);
        }
      });
    }

    if (Array.isArray(suite.suites)) {
      suite.suites.forEach((child) => processSuite(child, currentTitle));
    }
  }

  if (Array.isArray(report.suites)) {
    report.suites.forEach((suite) => processSuite(suite));
  } else if (Array.isArray(report.tests)) {
    report.tests.forEach((test) => {
      if (Array.isArray(test.results) && test.results.length) {
        test.results.forEach((result) => addTest(result, test.title, test.annotations || [], result.retry || 0));
      } else {
        addTest(test, test.title, test.annotations || [], test.retry || 0);
      }
    });
  }

  return tests;
}

function buildSummary(report) {
  const tests = extractTests(report);
  const allTests = tests.map((t) => ({
    title: t.title,
    status: t.status,
    duration: t.duration || 0,
    errors: t.errors || [],
    annotations: t.annotations || [],
    retry: t.retry || 0,
    expectedStatus: t.expectedStatus
  }));

  const failedTests = allTests.filter((t) => t.status === 'failed');
  const flakyTests = allTests.filter((t) =>
    t.annotations.some((annotation) => annotation.type === 'flaky') || (t.retry && t.retry > 0)
  );
  const skippedTests = allTests.filter((t) => t.status === 'skipped');
  const passedTests = allTests.filter((t) => t.status === 'passed');

  const totals = {
    total: allTests.length,
    passed: passedTests.length,
    failed: failedTests.length,
    flaky: flakyTests.length,
    skipped: skippedTests.length
  };

  const sortedByDuration = [...allTests].sort((a, b) => b.duration - a.duration).slice(0, 3);
  const averageDuration = allTests.length ? Math.round(allTests.reduce((sum, test) => sum + test.duration, 0) / allTests.length) : 0;

  const failures = failedTests.map((test) => {
    const rootCause = explainFailure(test);
    return `- ${test.title}: ${rootCause}`;
  });

  const flakyList = flakyTests.map((test) => `- ${test.title}`);
  const slowList = sortedByDuration.map((test) => `- ${test.title} (${Math.round(test.duration)}ms)`);

  const lines = [
    `Playwright summary for ${totals.total} tests:`,
    `  passed: ${totals.passed}`,
    `  failed: ${totals.failed}`,
    `  flaky: ${totals.flaky}`,
    `  skipped: ${totals.skipped}`,
    `Average test runtime: ${averageDuration}ms`,
    ''
  ];

  if (failedTests.length) {
    lines.push('Failed tests and likely causes:');
    lines.push(...failures);
    lines.push('');
  }

  if (flakyTests.length) {
    lines.push('Flaky or retried tests:');
    lines.push(...flakyList);
    lines.push('');
  }

  if (sortedByDuration.length) {
    lines.push('Slowest tests:');
    lines.push(...slowList);
    lines.push('');
  }

  if (!failedTests.length) {
    lines.push('All tests passed. No failures to investigate.');
  }

  return {
    text: lines.join('\n'),
    metrics: {
      totals,
      averageDuration,
      failedTests,
      flakyTests,
      slowTests: sortedByDuration
    }
  };
}

function explainFailure(test) {
  const message = (test.errors || []).map((error) => error.message || error).join(' ').toLowerCase();
  if (!message) {
    return 'Test failed with no structured error information.';
  }

  if (message.includes('locator.click') && message.includes('timeout')) {
    return 'the button did not become clickable before the timeout, likely rendering or network delay.';
  }

  if (message.includes('waiting for selector') && message.includes('timeout')) {
    return 'a page element did not appear in time, likely due to a missing selector or slow UI update.';
  }

  if (message.includes('to be visible') || message.includes('expect')) {
    return 'an assertion failed because the expected UI element was not visible or present.';
  }

  if (message.includes('navigation') && message.includes('timeout')) {
    return 'page navigation took too long, likely due to a slow response or redirect.';
  }

  if (message.includes('failed') && message.includes('status')) {
    return 'an API or network response returned an unexpected status code.';
  }

  return message.split('\n').slice(0, 2).join(' ');
}

async function uploadToTestRelic(report, summary) {
  const apiKey = process.env.TESTRELIC_API_KEY;
  if (!apiKey) {
    console.warn('Skipping TestRelic upload because TESTRELIC_API_KEY is not set.');
    return;
  }

  let api = null;
  try {
    api = require('@testrelic/playwright-analytics');
  } catch (error) {
    console.warn('TestRelic SDK is not installed. Install @testrelic/playwright-analytics to enable upload.');
    return;
  }

  if (typeof api.uploadTestResults !== 'function' && typeof api.default?.uploadTestResults !== 'function') {
    console.warn('TestRelic SDK found, but no upload function was detected.');
    return;
  }

  const uploadFn = typeof api.uploadTestResults === 'function' ? api.uploadTestResults : api.default.uploadTestResults;

  const payload = {
    apiKey,
    summary: summary.text,
    metrics: summary.metrics,
    report
  };

  try {
    console.log('Uploading test results to TestRelic...');
    await uploadFn(payload);
    console.log('TestRelic upload completed.');
  } catch (error) {
    console.warn('TestRelic upload failed:', error.message || error);
  }
}

function main() {
  const fullPath = path.resolve(reportPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing report file: ${fullPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  let report;
  try {
    report = JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse Playwright JSON report:', error.message);
    process.exit(1);
  }

  const summary = buildSummary(report);
  fs.writeFileSync(outputPath, summary.text, 'utf8');
  console.log(summary.text);
  console.log(`\nSummary written to ${outputPath}`);

  uploadToTestRelic(report, summary).catch(() => {
    /* ignore upload errors here */
  });
}

main();
