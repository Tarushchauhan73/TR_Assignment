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

## Loom Video

[Watch the demo on Loom](https://www.loom.com/share/92b204a23402443b9462d503b01845b7)

---
  # Project Structure for MCP
  
  TR_Assignment/
│
├── docs/
│   ├── mcp-insight.png
│   ├── testrelic-ai-analysis.png
│   ├── problem.md
│   └── scale.md
│
├── tests/
│   └── example.spec.ts
│
├── .vscode/
│   └── mcp.json
│
├── playwright.config.ts
├── package.json
└── README.md

---


# Screenshots

## TestRelic AI ANALYTICS REPORT
<img width="1440" height="900" alt="tr2" src="https://github.com/user-attachments/assets/9c54cc6b-7ef4-44ef-8473-5702ae133dc4" />

---

## TestRelic Dashboard

![TestRelic Dashboard](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/docs%3Atestrelic-dashboard.png)

---

### MCP Query + AI Insight

<img width="1440" height="900" alt="MCP_token" src="https://github.com/user-attachments/assets/9ce627e9-e25b-4571-8b21-e60c5955d1c6" />

---

## Test Results Dashboard

![Test Results](https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/tr2.png)

---
#index_port3030
https://ideal-space-xylophone-r44qgwwgw6j52pqjp-3000.app.github.dev
<img width="1440" height="900" alt="Screenshot 2026-05-25 at 3 48 01 PM" src="https://github.com/user-attachments/assets/fa7e1be8-287f-4b2b-8c9b-0e68ed875894" />

# MCP Screenshot Examples

## 1. Flaky Test Detection

### Prompt

```text
## Which tests are flaky based on the last 3 runs?

The test "checkout-payment.spec.ts" appears flaky.

Reason:
- Failed 2 out of last 5 runs
- Failure signatures are inconsistent
- Average execution time variance is high

Most common failure:
Timeout waiting for payment confirmation modal.

Recommendation:
Add explicit wait for payment API completion before  asserting UI state.


## Intentional failure

The suite includes one intentional failure to demonstrate TestRelic's failure
analysis. Run it explicitly:

```bash
npm run test:intentional-failure

https://github.com/Tarushchauhan73/TR_Assignment/blob/main/docs/screenshots/mcp_creation.png
<img width="1440" height="900" alt="mcp_creation" src="https://github.com/user-attachments/assets/80a90c41-c290-4b8d-874b-36bb84ed933b" />

```
2. Plain English Failure Analysis
##Explain the latest failed Playwright test in plain English.

The login flow test failed because the dashboard page never loaded after the user clicked Sign In.

Technical cause:
The selector ".dashboard-container" was not found within 30 seconds.

Likely customer impact:
Users may experience failed logins or slow authentication responses.

Suggested fix:
Check authentication API latency and add retry handling for dashboard rendering.

<img width="1440" height="900" alt="mcp_creation" src="https://github.com/user-attachments/assets/bf604ad1-2c06-4cfe-aad6-fc98c1c7c58b" />

---

3. High Value Tests
Prompt
Which tests are catching the most real issues?

Top high-signal tests:

1. auth-login.spec.ts
- Detected 3 production regressions
- Stable execution history

2. checkout-flow.spec.ts
- Frequently detects API synchronization bugs

3. search-filter.spec.ts
- High user-impact coverage
- Low flakiness score

Recommendation:
Prioritize maintaining these tests because they provide the highest debugging value.

<img width="1440" height="900" alt="Screenshot 2026-05-24 at 12 28 12 PM" src="https://github.com/user-attachments/assets/858a4e2e-1df5-403b-9516-49bf9c6186e1" />


---

4. Intentional Failure Analysis
Prompt
Analyze the intentionally failing test and explain root cause.
Example MCP Response
The test "invalid-password-login.spec.ts" failed intentionally.

Observed behavior:
Expected success message was asserted even though invalid credentials were provided.

Failure type:
Assertion mismatch

Why this is useful:
This test validates that the reporting pipeline correctly captures failures and provides actionable debugging information.

Suggested improvement:
Add failure classification tags for intentional regression simulations.

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
