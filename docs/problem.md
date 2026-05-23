# Problem Analysis

## What the customer says
“We have Playwright tests but nobody reads the reports.”

## Actual root problem
The existing test artifacts are too technical and too hard to parse quickly. Engineering teams get raw Playwright logs instead of a plain-English summary that highlights failures, flaky behavior, and slow tests.

## Jobs-to-be-done
- Make test results easy to understand at a glance.
- Surface failed tests, flakes, and slow cases automatically.
- Reduce time spent debugging by translating failures into likely causes.
- Upload insights into TestRelic for visibility and reporting.

## Failure modes
- Failed tests are buried in JSON or raw stack traces.
- Reports are ignored because they require manual review.
- Flaky tests are not detected, so teams chase inconsistent failures.
- Slow regressions are missed until they affect customer flows.

## Success metric
- Engineers can answer "what failed and why" from the summary without opening raw logs.
- The tool detects failed, flaky, and slow tests automatically.
- Test results are uploaded to TestRelic in CI.
- A single intentional failure produces a readable summary and insight artifact.
