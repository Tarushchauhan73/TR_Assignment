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
          apiKey: 'tr_live_d0428ea55f79a1ada426ff755957d9c48918f1b6570fcba510775f079ef2f49e',
        },
      },
    ],
  ],

  use: {
    trace: 'on-first-retry',
    headless: true,
  },
});