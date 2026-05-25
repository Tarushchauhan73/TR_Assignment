import { test, expect } from '@testrelic/playwright-analytics/fixture';

test('homepage test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('body')).toBeVisible();
});