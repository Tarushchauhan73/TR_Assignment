# Scale Brief

## Deployment Playbook

1. Customer signs up for TestRelic, creates a project, and copies `TESTRELIC_API_KEY`.
2. They install one package and add the Playwright reporter in `playwright.config.js`.
3. They run `npx test-signal analyze --report <report.json> --dry-run` locally to verify parsing and the plain-English output.
4. They add `TESTRELIC_API_KEY` as a CI secret and run Playwright in CI.
5. TestRelic confirms the first run was received and shows the first dashboard insight.
6. The customer asks the MCP server: "Which failures from the last run need developer action?"
7. Onboarding is complete when a developer uses one TestRelic insight to make a release or fix decision.

The biggest drop-off points are API key setup, reporter configuration, and confusion over where Playwright wrote the report. Mitigation: ship a `testrelic doctor` preflight that validates environment variables, package installation, reporter configuration, and connectivity before the first CI run.

## Top Integration Failure Patterns

**1. Missing API key**

Symptom: CI passes, but the TestRelic dashboard shows no new run.

Resolution:
- Confirm `TESTRELIC_API_KEY` exists in CI secrets.
- Run locally with `TESTRELIC_API_KEY=... npx playwright test`.
- Add an explicit CI step that fails fast when the secret is absent.

**2. Reporter not installed in the CI environment**

Symptom: Playwright exits with `Cannot find module '@testrelic/playwright-analytics'`.

Resolution:
- Add `@testrelic/playwright-analytics` to `package.json`, not only a local global install.
- Use `npm ci` in CI so the lockfile and installed package match.
- Re-run Playwright with the same Node version used locally.

**3. Report uploaded without useful context**

Symptom: Dashboard receives runs, but tests appear as generic names or cannot be tied to a branch, PR, or commit.

Resolution:
- Set `projectName` in the reporter config.
- Pass CI metadata such as commit SHA, branch, build URL, and pull request number.
- Rename tests around user outcomes, for example `guest can complete checkout`, instead of implementation details.

## Feedback Loop Design

Track events for `cli_analyze_started`, `cli_summary_generated`, `upload_attempted`, `upload_succeeded`, `upload_failed`, `dashboard_first_run_viewed`, `ai_insight_requested`, and `ai_insight_copied`. Include metadata for test count, failure count, retry-pass count, CI provider, reporter version, project age, and time from CI completion to insight view.

Activation threshold: a project is activated when it uploads three runs, has at least one failed test analyzed, and a developer views or copies an AI insight within 10 minutes of that failed run. That threshold proves the workflow moved from passive storage to an actual development decision.

## Product Insight

Problem: the hardest part for a small team is not writing the reporter config; it is knowing whether the integration really worked before waiting on CI. Proposed solution: add a `testrelic doctor` command that validates package installation, API key presence, reporter configuration, sample CTRF upload, and dashboard visibility in one preflight. Evidence: this assignment needs dashboard and MCP proof, but most failure states look identical from CI: tests run, artifacts exist, and no one knows whether TestRelic received the data until they inspect the dashboard manually.
