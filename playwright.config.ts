import { defineConfig } from '@testrelic/playwright-analytics';

export default defineConfig(
  { testDir: './tests' },
  { cloud: { apiKey: 'YOUR_API_KEY' } },
);