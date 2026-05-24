import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['list'],
    ['@testrelic/playwright-analytics', {
      cloud: {
        apiKey: process.env.TESTRELIC_API_KEY
      }
    }]
  ],
});