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

  // Assert: Check if the current URL matches the expected URL
  await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/');

  // Assert: Check if the page title contains a specific substring (using Regex)
  await expect(page).toHaveTitle(/Your Store/);

  const myAccountBtn = page.getByRole('button', { name: ' My account' });
  // Assert: Verify that an element is visible in the viewport
  await expect(myAccountBtn).toBeVisible();

  // Assert: Verify that an element is enabled (can be interacted with)
  await expect(myAccountBtn).toBeEnabled();
  await myAccountBtn.click();

  const registerLink = page.getByRole('link', { name: ' Register' });
  // Assert: Verify that an element has the exact expected text
  await expect(registerLink).toHaveText('Register');
  await registerLink.click();

  // Assert: Check that the URL changes correctly after navigation
  await expect(page).toHaveURL(/.*route=account\/register/);

  const firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
  await firstNameInput.click();
  await firstNameInput.fill('Malsha');

  // Assert: Verify that an input field contains the expected value after filling it
  await expect(firstNameInput).toHaveValue('Malsha');

  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nethmini');

  const uniqueEmail = `malshaathawuda+${Date.now()}@gmail.com`;
  const emailInput = page.getByRole('textbox', { name: 'E-Mail*' });
  await emailInput.click();
  await emailInput.fill(uniqueEmail);

  // Assert: Verify that an element has a specific HTML attribute and value
  await expect(emailInput).toHaveAttribute('type', 'email');

  await page.getByRole('textbox', { name: 'Telephone*' }).click();
  await page.getByRole('textbox', { name: 'Telephone*' }).fill('+94711382132');

  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('malsha');

  await page.getByRole('textbox', { name: 'Password Confirm*' }).click();
  await page.getByRole('textbox', { name: 'Password Confirm*' }).fill('malsha');

  // Assert: Check that a given element (checkbox) is initially NOT checked
  const agreeCheckbox = page.locator('input[name="agree"]');
  await expect(agreeCheckbox).not.toBeChecked();

  // Click on the label text which toggles the checkbox
  await page.getByText('I have read and agree to the').click();

  // Assert: Verify that the checkbox is checked after our click interaction
  await expect(agreeCheckbox).toBeChecked();

  // const continueBtn = page.getByRole('button', { name: 'Continue' });
  // await continueBtn.click();

  // Assert: Wait for and verify that registration success URL is reached
  await expect(page).toHaveURL(/.*route=account\/success/);

  const successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
  // Assert: Check if the success message heading is displayed on the screen
  await expect(successHeading).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Poco Electro' }).click();
  await page.getByRole('button', { name: 'AddOns Featured' }).click();
});

test('test02', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/');
  await expect(page.getByRole('button', { name: ' My account' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search For Products' }).click();
  await page.getByRole('button', { name: 'Search' }).click();

  await page.locator('#mz-filter-panel-0-0').getByRole('spinbutton', { name: 'Minimum Price' }).click();
  await page.locator('#mz-filter-panel-0-0').getByRole('spinbutton', { name: 'Minimum Price' }).fill('100');
  await page.locator('#mz-filter-panel-0-0').getByRole('spinbutton', { name: 'Maximum Price' }).click();
  await page.locator('#mz-filter-panel-0-0').getByRole('spinbutton', { name: 'Maximum Price' }).fill('2000');
  await page.waitForTimeout(4000)
});