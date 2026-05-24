import { test, expect } from '@testrelic/playwright-analytics/fixture';

test('homepage test', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example/);
});