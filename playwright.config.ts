import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report.json' }],   // ← ADD THIS
    ['html'],
    // Only load TestRelic reporter when API key is present
    ...(process.env.TESTRELIC_API_KEY                     // ← WRAP THIS
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