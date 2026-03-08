import { test, expect } from '@playwright/test';

// Use tags like @demo or @report to categorize tests. They show up in the report!
test('Demonstrate Playwright Report Features @report', async ({ page }, testInfo) => {
    // 1. ADDING ANNOTATIONS
    // Annotations can be used to link tests to issues, add descriptions, or mark specific metadata.
    test.info().annotations.push({ type: 'Issue', description: 'https://bugtracker.example.com/issue/1234' });
    test.info().annotations.push({ type: 'Test Type', description: 'Demonstration' });

    // 2. USING STEPS
    // Steps break down a test into logical, easier-to-read chunks in the report.
    await test.step('Navigate to the initial page', async () => {
        await page.goto('https://ecommerce-playground.lambdatest.io/');
        // 3. CONSOLE LOGS
        // Logs perfectly appear inside the report specifically under this step.
        console.log('Navigated to LambdaTest playground successfully');
    });

    await test.step('Interact with elements', async () => {
        const searchInput = page.getByRole('textbox', { name: 'Search For Products' });
        await searchInput.fill('laptop');
        await page.getByRole('button', { name: 'Search' }).click();
    });

    await test.step('Perform assertions', async () => {
        await expect(page).toHaveURL(/.*search=laptop/);
    });

    // 4. ATTACHMENTS
    // You can attach text, screenshots, JSON, and anything else directly to the report!
    await test.step('Attach custom data to report', async () => {
        // Attaching a simple text message
        await testInfo.attach('Test data JSON', {
            body: JSON.stringify({ searchTerm: 'laptop', resultCount: 5 }, null, 2),
            contentType: 'application/json',
        });

        // Take and attach a screenshot directly to the report at this current moment.
        const screenshot = await page.screenshot();
        await testInfo.attach('Search Results Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    });
});

test('A skipped test @report', async ({ page }) => {
    // 5. SKIPPING TESTS
    // This test will be skipped and marked as "Skipped" in the HTML report.
    test.skip(true, 'Skipping this test because the feature is not ready yet');
    await page.goto('https://ecommerce-playground.lambdatest.io/');
});

test('A test expected to fail @report', async ({ page }) => {
    // 6. EXPECTED FAILURES
    // Mark tests that are expected to fail right now (e.g., catching a known bug).
    // In the report, this will be grouped under "Expected Failures".
    test.fail(true, 'This test is supposed to fail due to a known bug #5678');
    await page.goto('https://ecommerce-playground.lambdatest.io/');

    // This assertion will fail, but since we used test.fail(), the test itself will pass 
    // and be listed as an expected failure.
    await expect(page).toHaveTitle(/Non Existent Title/);
});

test.fixme('A test that needs fixing @report', async ({ page }) => {
    // 7. FIXME TESTS
    // Similar to skip, but indicates that the test is currently broken and needs updating.
    // Shows up differently in the report summary.
    await page.goto('https://ecommerce-playground.lambdatest.io/');
});
