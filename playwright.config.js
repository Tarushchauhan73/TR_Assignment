import { defineConfig } from '@playwright/test';

const reporters = [
  ['line'],
  ['json', { outputFile: 'test-results/playwright-report.json' }]
];

if (process.env.TESTRELIC_API_KEY) {
  reporters.push([
    '@testrelic/playwright-analytics',
    {
      apiKey: process.env.TESTRELIC_API_KEY,
      projectName: 'fde-assignment-test-signal'
    }
  ]);
}

export default defineConfig({
  testDir: './tests',
  reporter: reporters,
  timeout: 10_000,
  use: {
    trace: 'retain-on-failure'
  }
});
