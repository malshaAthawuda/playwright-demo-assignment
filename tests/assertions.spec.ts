import { test, expect } from '@playwright/test';

// test("loging test demo", async ({ page }) => {
//     await page.goto("https://ecommerce-playground.lambdatest.io/");

//     await page.getByRole('button', { name: ' My account' }).hover();
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByRole('textbox', { name: 'E-Mail Address' }).fill('malsha2003@gmail.com');
//     await page.getByRole('textbox', { name: 'Password' }).fill('malsha123');
//     await page.getByRole('button', {name: 'Login'}).click()
//     await page.waitForTimeout(5000)

// });


test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/');
  await page.getByRole('button', { name: ' My account' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Malsha');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nethmini');
  await page.getByRole('textbox', { name: 'E-Mail*' }).click();
  await page.getByRole('textbox', { name: 'E-Mail*' }).fill('malshaathawuda@gmail.com');
  await page.getByRole('textbox', { name: 'Telephone*' }).click();
  await page.getByRole('textbox', { name: 'Telephone*' }).fill('0711382132');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('malsha');
  await page.getByRole('textbox', { name: 'Password Confirm*' }).click();
  await page.getByRole('textbox', { name: 'Password Confirm*' }).fill('malsha');
  await page.getByText('I have read and agree to the').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Poco Electro' }).click();
  await page.getByRole('button', { name: 'AddOns Featured' }).click();
  await page.getByRole('link', { name: 'Modules' }).click();
  await expect(page.getByRole('button', { name: '0' })).toBeVisible();
  await page.getByRole('button', { name: 'Shop by Category' }).click();
  await page.getByRole('heading', { name: 'Top categories close' }).getByLabel('close').click();
});