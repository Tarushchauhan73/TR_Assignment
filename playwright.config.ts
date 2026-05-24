import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['list']
  ],

  use: {
    trace: 'on-first-retry',
  },
});