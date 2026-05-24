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

  # Project Structure

```bash
TR_Assignment/
│
├── .github/
│   └── workflows/              # GitHub Actions workflows
│
├── .testrelic/                 # TestRelic configuration
│
├── bin/                        # Helper scripts
│
├── docs/
│   ├── screenshots/            # Dashboard and MCP screenshots
│   ├── dashboard-evidence.md
│   ├── problem.md
│   ├── scale.md
│   └── testrelic.md
│
├── playwright-report/          # Playwright HTML reports
│
├── src/                        # Source code
│
├── test-results/               # Generated test results
│
├── test_signal/                # Signal configurations
│
├── tests/                      # Playwright test cases
│
├── types/node/                 # Node type definitions
│
├── .env.example                # Environment variables example
├── .gitignore
├── MCP
├── README.md
└── package-lock.json
```

---


## Intentional failure

The suite includes one intentional failure to demonstrate TestRelic's failure
analysis. Run it explicitly:

```bash
npm run test:intentional-failure
```

---

# Screenshots

## MCP Token

![MCP Token](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/MCP_token.png)

---

## TestRelic Dashboard

![TestRelic Dashboard](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/docs%3Atestrelic-dashboard.png)

---

### MCP Query + AI Insight

![MCP Creation](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/mcp_creation.png)

---

## Test Results Dashboard

![Test Results](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/tr2.png)

---

## CI

GitHub Actions runs on every push to `main`. Set `TESTRELIC_API_KEY` as a
repository secret to enable dashboard uploads from CI.

---

# Repository

https://github.com/Tarushchauhan73/TR_Assignment

---


# Author

Tarush Chauhan

GitHub: https://github.com/Tarushchauhan73

## Deliverables

- [Problem Decomposition](docs/problem.md)
- [Scale Brief](docs/scale.md)
- [CI Run](https://github.com/Tarushchauhan73/TR_Assignment/actions)
