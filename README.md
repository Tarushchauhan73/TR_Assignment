# Playwright Summary AI

A Python-first CLI tool and example Playwright suite that turns raw Playwright JSON results into readable summaries, detects failures/flakes/slow tests, and uploads artifacts to TestRelic.

## What it does
- Runs an example Playwright test suite
- Generates `playwright-report.json`
- Produces plain-English summaries with both the original Node helper and the Python CLI
- Attempts a TestRelic upload when `TESTRELIC_API_KEY` is configured

## Quickstart

Install dependencies:

```bash
npm install
npx playwright install --with-deps
```

Run the demo tests and summary:

```bash
npm test
npm run summary
npm run summary:python
```

The `playwright-report.json` file is generated automatically by Playwright via the project reporter configuration.

To upload results to TestRelic when running locally, export your API key and project name first:

```bash
export TESTRELIC_API_KEY=your_api_key
export TESTRELIC_PROJECT_NAME=fde-assignment
npm test
```

After running tests the TestRelic reporter will upload results to your TestRelic project (if the key is valid). See `/docs/testrelic.md` for MCP instructions and evidence capture.

Set `TESTRELIC_API_KEY` to upload results to TestRelic in CI:

```bash
export TESTRELIC_API_KEY=your_api_key
npm run summary
```

Run the Python CLI directly when you want the fastest local feedback:

```bash
python3 -m test_signal analyze --report playwright-report.json --out test-summary-python.txt
```

## Files
- `tests/playwright.spec.js` — example Playwright tests including one intentional failure.
- `tests/fixtures/demo-app.html` — local demo app used by the tests.
- `src/summarize-results.js` — CLI summarizer and TestRelic uploader.
- `test_signal/` — Python CLI that parses Playwright/CTRF, explains failures, detects flaky retry-passes, and can dry-run or post CTRF payloads.
- `bin/test-signal.py` — Python executable entrypoint.
- `docs/problem.md` — problem analysis and success metrics.
- `docs/scale.md` — scale thinking and onboarding notes.
- `.github/workflows/ci.yml` — CI workflow for install, test, summary, and artifact upload.

## CI
The GitHub Actions workflow installs Node, installs Playwright browsers, runs tests, summarizes results, and uploads artifacts.

## Notes
If `@testrelic/playwright-analytics` is not available or `TESTRELIC_API_KEY` is not set, the tool still writes a summary artifact and prints the reason.
