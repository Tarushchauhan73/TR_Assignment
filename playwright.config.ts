import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['html'],
    ['@testrelic/playwright-analytics', {
      apiKey: process.env.TESTRELIC_API_KEY,
      projectName: process.env.TESTRELIC_PROJECT_NAME || 'fde-assignment',
    }],
  ],
});