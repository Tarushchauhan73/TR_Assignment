import { test, expect } from '@testrelic/playwright-analytics/fixture';
import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('prints a plain-English failure summary from a Playwright JSON report', async () => {
  const { stdout } = await execFileAsync('node', [
    './tests/run-python-cli.js',
    'analyze',
    '--report',
    './tests/fixtures/playwright-report.json'
  ]);

  expect(stdout).toContain('Ran 4 tests: 3 passed, 1 failed, 0 skipped.');
  expect(stdout).toContain('The page showed different text than the test expected.');
});

test('flags retry-passing tests as possible flaky noise', async () => {
  const { stdout } = await execFileAsync('node', [
    './tests/run-python-cli.js',
    'analyze',
    '--report',
    './tests/fixtures/playwright-report.json'
  ]);

  expect(stdout).toContain('Possible flaky noise:');
  expect(stdout).toContain('cart total updates after quantity change (2 attempts)');
});

test('writes the same summary to an output file for CI artifacts', async ({}, testInfo) => {
  const outputPath = testInfo.outputPath('summary.txt');

  await execFileAsync('node', [
    './tests/run-python-cli.js',
    'analyze',
    '--report',
    './tests/fixtures/playwright-report.json',
    '--out',
    outputPath
  ]);

  await expect(readFile(outputPath, 'utf8')).resolves.toContain('Test Signal Summary');
});

test('accepts CTRF input and supports upload dry runs', async ({}, testInfo) => {
  const ctrfPath = testInfo.outputPath('ctrf.json');
  await writeFile(
    ctrfPath,
    JSON.stringify({
      results: {
        tool: { name: 'playwright' },
        summary: { tests: 1, passed: 1, failed: 0, skipped: 0, pending: 0, other: 0, duration: 30 },
        tests: [{ name: 'login works', status: 'passed', duration: 30 }]
      }
    }),
    'utf8'
  );

  const { stdout } = await execFileAsync('node', [
    './tests/run-python-cli.js',
    'analyze',
    '--report',
    ctrfPath,
    '--upload',
    '--dry-run'
  ]);

  expect(stdout).toContain('Ran 1 tests: 1 passed, 0 failed, 0 skipped.');
  expect(stdout).toContain('Dry run: would upload 1 CTRF tests');
});

test('fails clearly when upload is requested without an API key', async () => {
  await expect(
    execFileAsync('node', [
      './tests/run-python-cli.js',
      'analyze',
      '--report',
      './tests/fixtures/playwright-report.json',
      '--upload'
    ], {
      env: { ...process.env, TESTRELIC_API_KEY: '' }
    })
  ).rejects.toThrow(/TESTRELIC_API_KEY is required/);
});
