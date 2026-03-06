import { test, expect } from '@playwright/test';

/**
 * ============================================================
 *  MOCKING & STUBBING DEMONSTRATION — Playwright
 * ============================================================
 *
 *  Playwright provides page.route() to intercept network requests.
 *  This enables:
 *    1. Stubbing API responses (return fake data)
 *    2. Mocking network errors (simulate failures)
 *    3. Modifying responses (alter real server responses)
 *    4. Blocking resources (e.g., images, CSS)
 *    5. Intercepting and verifying request payloads
 *
 *  Why is Mocking important in Quality Engineering?
 *  - Tests become fast, deterministic, and independent of external services
 *  - We can simulate edge cases (errors, empty data, slow responses)
 *  - No reliance on third-party APIs or backend availability
 *  - Enables shift-left testing — test frontend logic before backend is ready
 * ============================================================
 */

// Increase timeout for all tests in this file (network-dependent tests)
test.use({ actionTimeout: 15000, navigationTimeout: 45000 });

// ────────────────────────────────────────────────────────────
// 1. STUB AN API RESPONSE — Return completely fake JSON data
// ────────────────────────────────────────────────────────────
test.describe('1. Stubbing API Responses', () => {

  test('Stub a product search API to return fake product data', async ({ page }) => {
    // Intercept any request that contains "search" in its URL
    // and return a fake JSON response instead of hitting the real server
    await page.route('**/index.php?route=product/search**', async (route) => {
      console.log('🔀 Intercepted search request — returning stubbed response');

      // Fulfill the request with our own fake HTML containing a mock product
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <html>
            <body>
              <h1>Search Results (Stubbed)</h1>
              <div class="product-card">
                <h4 class="title">Mock Product - Playwright Phone</h4>
                <span class="price">$199.99</span>
              </div>
            </body>
          </html>
        `,
      });
    });

    // Navigate to the search page — the route intercept will serve our fake page
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=phone');

    // Verify the stubbed content is displayed
    await expect(page.locator('h4.title')).toHaveText('Mock Product - Playwright Phone');
    await expect(page.locator('span.price')).toHaveText('$199.99');
    console.log('✅ Stubbed API response verified successfully');
  });
});

// ────────────────────────────────────────────────────────────
// 2. MOCK A NETWORK ERROR — Simulate server failure
// ────────────────────────────────────────────────────────────
test.describe('2. Mocking Network Errors', () => {

  test('Simulate a network failure when loading an image', async ({ page }) => {
    let abortedRequests = 0;

    // Abort all image requests to simulate image load failures
    await page.route('**/*.{png,jpg,jpeg,gif,webp}', async (route) => {
      abortedRequests++;
      await route.abort('failed');  // Simulate network failure
    });

    await page.goto('https://ecommerce-playground.lambdatest.io/', { timeout: 45000 });

    // Verify that we aborted at least some image requests
    console.log(`🚫 Aborted ${abortedRequests} image request(s)`);
    expect(abortedRequests).toBeGreaterThan(0);

    // Verify the page still loads even though images failed
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Page loaded successfully despite image failures');
  });
});

// ────────────────────────────────────────────────────────────
// 3. MODIFY A REAL RESPONSE — Intercept and alter server data
// ────────────────────────────────────────────────────────────
test.describe('3. Modifying Real Responses', () => {

  test('Intercept and modify the homepage title in the response', async ({ page }) => {
    // Intercept the main page request and modify the response body
    await page.route('https://ecommerce-playground.lambdatest.io/', async (route) => {
      // Fetch the real response from the server
      const response = await route.fetch();
      let body = await response.text();

      // Modify the title tag in the real HTML response
      body = body.replace(/<title>.*?<\/title>/, '<title>Modified By Playwright Mock</title>');

      // Fulfill with the modified response
      await route.fulfill({
        response: response,
        body: body,
      });

      console.log('📝 Modified the page title in the response');
    });

    await page.goto('https://ecommerce-playground.lambdatest.io/', { timeout: 45000 });

    // Verify the title was modified
    await expect(page).toHaveTitle('Modified By Playwright Mock');
    console.log('✅ Response modification verified — title was changed');
  });
});

// ────────────────────────────────────────────────────────────
// 4. BLOCK SPECIFIC RESOURCES — Stub by blocking CSS/JS
// ────────────────────────────────────────────────────────────
test.describe('4. Blocking Resources (Selective Stubbing)', () => {

  test('Block all CSS files to test page without styles', async ({ page }) => {
    let blockedCSS = 0;

    // Block all CSS requests
    await page.route('**/*.css', async (route) => {
      blockedCSS++;
      await route.abort();  // Block the CSS file
    });

    await page.goto('https://ecommerce-playground.lambdatest.io/', { timeout: 45000 });

    console.log(`🎨 Blocked ${blockedCSS} CSS file(s)`);
    expect(blockedCSS).toBeGreaterThan(0);

    // The page should still be functional even without CSS
    const body = page.locator('body');
    await expect(body).toBeVisible();
    console.log('✅ Page is still functional without CSS — resources blocked successfully');
  });
});

// ────────────────────────────────────────────────────────────
// 5. INTERCEPT & VERIFY REQUEST PAYLOADS — Spy on outgoing data
// ────────────────────────────────────────────────────────────
test.describe('5. Intercepting and Verifying Request Payloads', () => {

  test('Capture and verify search query sent to the server', async ({ page }) => {
    let capturedURL = '';
    let capturedMethod = '';

    // Use page.route() to intercept and spy on the search request
    await page.route('**/index.php?route=product/search**', async (route) => {
      capturedURL = route.request().url();
      capturedMethod = route.request().method();
      console.log(`🔍 Intercepted ${capturedMethod} request: ${capturedURL}`);

      // Let the request continue to the real server (spy mode)
      await route.continue();
    });

    // Navigate directly to a search URL — this triggers our route intercept
    await page.goto(
      'https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=HTC',
      { timeout: 20000 }
    );

    // Verify we intercepted the request and it contains correct search term
    expect(capturedURL).toContain('search=HTC');
    expect(capturedMethod).toBe('GET');
    console.log('✅ Search payload verified — intercepted request contained correct search term');
    console.log(`   Method: ${capturedMethod}, URL contains 'search=HTC': true`);
  });
});

// ────────────────────────────────────────────────────────────
// 6. STUB WITH DELAYED RESPONSE — Simulate slow server
// ────────────────────────────────────────────────────────────
test.describe('6. Simulating Slow Responses', () => {

  test('Add artificial delay to simulate a slow API response', async ({ page }) => {
    // Intercept the homepage and add a 2-second delay
    await page.route('https://ecommerce-playground.lambdatest.io/', async (route) => {
      console.log('⏳ Delaying response by 2 seconds to simulate slow server...');

      // Wait 2 seconds before forwarding the real response
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('https://ecommerce-playground.lambdatest.io/', { timeout: 60000 });
    const loadTime = Date.now() - startTime;

    // Verify the page took at least 2 seconds (our artificial delay)
    expect(loadTime).toBeGreaterThanOrEqual(2000);
    console.log(`✅ Page loaded in ${loadTime}ms (includes 2s artificial delay)`);
    console.log('   This proves slow server simulation works for performance testing');
  });
});
