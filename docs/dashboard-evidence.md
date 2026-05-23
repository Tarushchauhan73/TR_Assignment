# TestRelic Evidence

This repo is wired for real TestRelic upload, but the final dashboard and MCP screenshots require a valid TestRelic account and API key.

## Dashboard Screenshot

After running the commands below, save a real screenshot here:

- `docs/testrelic-dashboard.png`

```bash
export TESTRELIC_API_KEY=your_key_here
npm test
npm run test:intentional-failure
```

## MCP Query Screenshot

Use the TestRelic MCP server after the run is visible in the dashboard. Suggested prompt:

```text
Which tests in fde-assignment-test-signal are most likely to be flaky based on the last 3 runs, and which failed test needs developer action first?
```

Save the real screenshot here:

- `docs/testrelic-mcp-insight.png`
