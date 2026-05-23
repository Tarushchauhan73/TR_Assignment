# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright.spec.js >> intentional failure reproduces a report issue
- Location: tests/playwright.spec.js:44:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=WrongText')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=WrongText')

```

```yaml
- heading "Login" [level=2]
- text: Username
- textbox "Username"
- text: Password
- textbox "Password"
- button "Login"
- status
```

# Test source

```ts
  1  | const path = require('path');
  2  | const { test, expect } = require('@playwright/test');
  3  | const appPath = path.join(__dirname, 'fixtures', 'demo-app.html');
  4  | const appUrl = `file://${appPath}`;
  5  | 
  6  | const login = async (page) => {
  7  |   await page.goto(appUrl);
  8  |   await page.fill('#username', 'user@example.com');
  9  |   await page.fill('#password', 'password123');
  10 |   await page.click('button:has-text("Login")');
  11 |   await expect(page.locator('text=Dashboard')).toBeVisible();
  12 | };
  13 | 
  14 | test('login works', async ({ page }) => {
  15 |   await login(page);
  16 |   await expect(page.locator('text=Login successful')).toBeVisible();
  17 | });
  18 | 
  19 | test('invalid login fails', async ({ page }) => {
  20 |   await page.goto(appUrl);
  21 |   await page.fill('#username', 'wrong@example.com');
  22 |   await page.fill('#password', 'badpass');
  23 |   await page.click('button:has-text("Login")');
  24 |   await expect(page.locator('#login-message')).toHaveText('Invalid credentials');
  25 | });
  26 | 
  27 | test('dashboard loads after login', async ({ page }) => {
  28 |   await login(page);
  29 |   await expect(page.locator('#dashboard-panel')).toBeVisible();
  30 | });
  31 | 
  32 | test('search works', async ({ page }) => {
  33 |   await login(page);
  34 |   await page.fill('#search-input', 'Apple');
  35 |   await expect(page.locator('#search-result')).toHaveText('Found 1 product: Apple AirPods');
  36 | });
  37 | 
  38 | test('checkout flow works', async ({ page }) => {
  39 |   await login(page);
  40 |   await page.click('#checkout-button');
  41 |   await expect(page.locator('#checkout-result')).toHaveText('Checkout completed successfully.');
  42 | });
  43 | 
  44 | test('intentional failure reproduces a report issue', async ({ page }) => {
  45 |   await page.goto(appUrl);
> 46 |   await expect(page.locator('text=WrongText')).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  47 | });
  48 | 
```