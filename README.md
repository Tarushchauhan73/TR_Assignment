# Playwright Summary AI

A CLI tool that turns Playwright test results into actionable plain-English
summaries and uploads them to TestRelic.

## Quickstart (under 15 minutes)

```bash
git clone https://github.com/Tarushchauhan73/TR_Assignment
cd TR_Assignment
npm install
npx playwright install --with-deps
pip install -r requirements.txt
```

Set your TestRelic API key:

```bash
export TESTRELIC_API_KEY=your_api_key
export TESTRELIC_PROJECT_NAME=fde-assignment
```

Run tests and generate summaries:

```bash
npm test
npm run summary
npm run summary:python
```

## What it does

- Runs a Playwright test suite against a local demo app
- Generates `playwright-report.json` via Playwright's JSON reporter
- Produces `test-summary.txt` — a plain-English Node.js summary
- Produces `test-summary-python.txt` — a Python CLI summary with flake detection
- Uploads results to TestRelic in real time when `TESTRELIC_API_KEY` is set

## Intentional failure

The suite includes one intentional failure to demonstrate TestRelic's failure
analysis. Run it explicitly:

```bash
npm run test:intentional-failure
```

## CI

GitHub Actions runs on every push to `main`. Set `TESTRELIC_API_KEY` as a
repository secret to enable dashboard uploads from CI.

## Deliverables

- [Problem Decomposition](docs/problem.md)
- [Scale Brief](docs/scale.md)
- [CI Run](https://github.com/Tarushchauhan73/TR_Assignment/actions)