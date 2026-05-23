# Scale and Growth Considerations

## Onboarding 50 customers
- Provide a simple installation path: `npm install @testrelic/playwright-analytics` and add one CLI step.
- Offer a small config file or env variables to map each repo to a customer account.
- Support standard Playwright JSON output so existing pipelines require minimal changes.
- Supply examples for GitHub Actions, GitLab CI, and Bitbucket.

## Common CI/CD failures
- Missing `TESTRELIC_API_KEY` or invalid credentials.
- Playwright browser dependencies not installed before test execution.
- JSON report path mismatch between test runner and summary command.
- Flaky tests hiding in retries and mis-reported pass/fail state.

## SDK problems to watch for
- SDK version drift across customers and node versions.
- Missing or incompatible exports in `@testrelic/playwright-analytics`.
- Slow SDK uploads blocking CI jobs.
- Unclear error handling when uploads fail.

## Activation metrics
- Number of repos installing the summary script.
- Rate of CI jobs producing a summary artifact.
- Percentage of runs that upload success data to TestRelic.
- Average time from test completion to summary generation.

## Product improvement idea
- Add a single-page report viewer that highlights top failures, flaky tests, and slow regression trends.
- Provide a TestRelic badge for test health and failure trends.
- Auto-surface the most actionable next step: "Fix this selector", "Retry flaky suite", or "Investigate slow checkout flow." 
