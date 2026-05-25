import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report.json' }],
    ['html'],
    ['@testrelic/playwright-analytics', {
      outputPath: './test-results/analytics-timeline.json',
      includeStackTrace: true,
      includeCodeSnippets: true,
      includeNetworkStats: true,
    }],
  ],
  // ← ADD THIS SECTION
  use: {
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
  webServer: {
    command: 'npx http-server ./tests/fixtures -p 3000',
    port: 3000,
    reuseExistingServer: true,
  },
});