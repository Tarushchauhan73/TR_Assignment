import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['html'],
    ...(process.env.TESTRELIC_API_KEY
      ? [
          [
            '@testrelic/playwright-analytics',
            {
              cloud: {
                apiKey: process.env.TESTRELIC_API_KEY,
                upload: 'realtime',
                uploadArtifacts: true,
                artifactMaxSizeMb: 10,
                timeout: 30000,
              },
            },
          ] as const,
        ]
      : []),
  ],
});