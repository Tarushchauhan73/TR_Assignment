const path = require('path');
const { test, expect } = require('@playwright/test');
const appPath = path.join(__dirname, 'fixtures', 'demo-app.html');
const appUrl = `file://${appPath}`;

const login = async (page) => {
  await page.goto(appUrl);
  await page.fill('#username', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('button:has-text("Login")');
  await expect(page.locator('text=Dashboard')).toBeVisible();
};

test('login works', async ({ page }) => {
  await login(page);
  await expect(page.locator('text=Login successful')).toBeVisible();
});

test('invalid login fails', async ({ page }) => {
  await page.goto(appUrl);
  await page.fill('#username', 'wrong@example.com');
  await page.fill('#password', 'badpass');
  await page.click('button:has-text("Login")');
  await expect(page.locator('#login-message')).toHaveText('Invalid credentials');
});

test('dashboard loads after login', async ({ page }) => {
  await login(page);
  await expect(page.locator('#dashboard-panel')).toBeVisible();
});

test('search works', async ({ page }) => {
  await login(page);
  await page.fill('#search-input', 'Apple');
  await expect(page.locator('#search-result')).toHaveText('Found 1 product: Apple AirPods');
});

test('checkout flow works', async ({ page }) => {
  await login(page);
  await page.click('#checkout-button');
  await expect(page.locator('#checkout-result')).toHaveText('Checkout completed successfully.');
});

test('intentional failure reproduces a report issue', async ({ page }) => {
  test.skip(!process.env.RUN_INTENTIONAL_FAILURE, 'Run with RUN_INTENTIONAL_FAILURE=1 when capturing TestRelic failure evidence.');

  await page.goto(appUrl);
  await expect(page.locator('text=WrongText')).toBeVisible();
});
