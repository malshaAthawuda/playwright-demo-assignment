// import { test, expect } from '@playwright/test';

// test.describe('Setup / Teardown Demo', () => {

//   test.beforeEach(async ({ page }) => {
//     // Setup: open login page (or homepage)
//     await page.goto('https://example.com');
//     console.log('Setup: Navigated to homepage');
//   });

//   test.afterEach(async ({ page }) => {
//     // Teardown: just a log, could also logout or clear storage
//     console.log('Teardown: Finished test');
//   });

//   test('Test after setup', async ({ page }) => {
//     // Use page after setup
//     const heading = page.locator('h1');
//     await expect(heading).toHaveText('Example Domain');
//     console.log('Test executed successfully');
//   });

//   test('Another test using setup', async ({ page }) => {
//     // Another test to demonstrate multiple tests with setup
//     await expect(page).toHaveURL(/example\.com/);
//   });

// });