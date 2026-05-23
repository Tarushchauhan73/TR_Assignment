import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['@testrelic/playwright-analytics', {
      apiKey: process.env.TESTRELIC_API_KEY,
      projectName: process.env.TESTRELIC_PROJECT_NAME || 'fde-assignment'
    }]
  ]
});
