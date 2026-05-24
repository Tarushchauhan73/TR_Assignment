import defineConfig from '@testrelic/playwright-analytics';

export default new defineConfig({
  testDir: './tests',
  timeout: 10_000,
  use: {
    trace: 'retain-on-failure',
  },
  cloud: {
    apiKey: 'tr_live_d0428ea55f79a1ada426ff755957d9c48918f1b6570fcba510775f079ef2f49e',
  },
});
