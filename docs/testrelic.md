# TestRelic Integration and MCP Usage

This document explains how to run the Playwright suite, upload results to TestRelic, and capture MCP insights.

1) Set your TestRelic environment variables

```bash
export TESTRELIC_API_KEY=your_api_key_here
export TESTRELIC_PROJECT_NAME=fde-assignment
```

2) Run Playwright tests (the `@testrelic/playwright-analytics` reporter will upload results automatically)

```bash
npm test
```

3) Generate the plain-English summary (local artifact)

```bash
npm run summary
# summary will be written to test-summary.txt
```

4) Evidence to capture for submission
- Screenshot of TestRelic dashboard showing your test run and the failed test(s): save as `/docs/screenshots/testrelic-dashboard.png`
- Screenshot of an MCP prompt + AI response: save as `/docs/screenshots/mcp-insight.png`

Example MCP prompt to run against the MCP server:

"Which tests are most likely to be flaky based on the last 3 runs? Explain why and list evidence."

Add the resulting AI response screenshot into `/docs/screenshots` and reference it in `README.md`.

Notes
- If `TESTRELIC_API_KEY` is not set the reporter will skip uploading; the local JSON and `test-summary.txt` are still produced.
- If your CI uses secrets, set `TESTRELIC_API_KEY` in CI secrets and `TESTRELIC_PROJECT_NAME` as well.
