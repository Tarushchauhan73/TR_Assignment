import { defineConfig } from '@playwright/test';

const reporter = [
  ['list'],
  ['json', { outputFile: 'playwright-report.json' }]
];

if (process.env.TESTRELIC_API_KEY) {
  reporter.push([
    '@testrelic/playwright-analytics',
    {
      apiKey: process.env.TESTRELIC_API_KEY,
      projectName: process.env.TESTRELIC_PROJECT_NAME || 'fde-assignment'
    }
  ]);
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter
});
