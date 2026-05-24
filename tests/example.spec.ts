import { test, expect } from '@playwright/test';

test('homepage test', async ({ page }) => {
  await page.goto('https://example.com');

  await expect(page).toHaveTitle(/Example/);
});