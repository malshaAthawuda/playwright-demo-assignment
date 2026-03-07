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


test('assertionTest', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/');
  await page.getByRole('button', { name: ' My account' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Malsha');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nethmini');
  const uniqueEmail = `malshaathawuda+${Date.now()}@gmail.com`;
  await page.getByRole('textbox', { name: 'E-Mail*' }).click();
  await page.getByRole('textbox', { name: 'E-Mail*' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Telephone*' }).click();
  await page.getByRole('textbox', { name: 'Telephone*' }).fill('+94711382132');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('malsha');
  await page.getByRole('textbox', { name: 'Password Confirm*' }).click();
  await page.getByRole('textbox', { name: 'Password Confirm*' }).fill('malsha');
  await page.getByText('I have read and agree to the').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Poco Electro' }).click();
  await page.getByRole('button', { name: 'AddOns Featured' }).click();
});