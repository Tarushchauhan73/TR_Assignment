import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'playwright-report.json' }],
    [
      '@testrelic/playwright-analytics',
      {
        cloud: {
          apiKey: process.env.TESTRELIC_API_KEY,
        },
      },
    ],
  ],
});