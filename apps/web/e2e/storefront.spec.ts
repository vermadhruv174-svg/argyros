import { expect, Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const expectedEnvironment = (
  process.env.E2E_EXPECTED_ENV ||
  process.env.E2E_APP_ENV ||
  process.env.APP_ENV ||
  'development'
).toLowerCase();

async function useOfflineFallbacks(page: Page) {
  // The storefront has a documented Foundation catalogue/local-cart fallback.
  // Keep acceptance coverage deterministic when the API/database is not running.
  await page.addInitScript(() => {
    window.localStorage.removeItem('argyros_local_cart');
    window.localStorage.removeItem('argyros_cart_token');
  });
  await page.route('**/api/cart**', (route) => route.abort());
  await page.route('**/api/auth/**', (route) => route.abort());
}

async function useMockAdminSession(page: Page) {
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'e2e-admin-access-token' }),
    }),
  );
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'e2e-admin-id',
        email: 'admin-e2e@example.invalid',
        firstName: 'E2E',
        lastName: 'Admin',
        role: 'ADMIN',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    }),
  );
  await page.route('**/api/admin/**', (route) => route.abort());
}

async function fillSyntheticCheckoutDetails(page: Page) {
  // Synthetic values only. This deliberately never exercises a real customer
  // record or payment credential.
  await page.locator('#email').fill('checkout-e2e@example.invalid');
  await page.locator('#firstName').fill('E2E');
  await page.locator('#lastName').fill('Test');
  await page.locator('#line1').fill('1 Test Street');
  await page.locator('#city').fill('Test City');
  await page.locator('#state').fill('Test State');
  await page.locator('#postalCode').fill('000000');
  await page.locator('#country').fill('India');
  await page.getByRole('checkbox').check();
}

test.describe('public storefront', () => {
  test('homepage, shop and product pages render the public catalogue', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/');

    await expect(page).toHaveTitle(/Argyros/);
    await expect(page.getByRole('heading', { name: /Made to become yours/i })).toBeVisible();

    await page.goto('/shop');
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole('heading', { name: 'Sterling silver, made personal.' })).toBeVisible();

    await page.getByRole('link', { name: 'Nova Halo Ring', exact: true }).click();
    await expect(page).toHaveURL(/\/products\/nova-halo-ring$/);
    await expect(page.getByRole('heading', { name: 'Nova Halo Ring' })).toBeVisible();
  });

  test('a product can be added to the bag without payment setup', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/products/nova-halo-ring');

    await page.getByRole('button', { name: /^Add to Bag/ }).first().click();

    const drawer = page.getByRole('dialog', { name: /Your Bag \(1\)/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Nova Halo Ring' })).toBeVisible();
    await expect(drawer.getByText('Proceed to Checkout')).toBeVisible();
  });

  test('checkout shows an empty-bag state', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/checkout');

    await expect(page.getByText('Your selection bag is empty.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Explore Solid 925 Collection/i })).toHaveAttribute(
      'href',
      '/shop',
    );
  });

  test('checkout surfaces a service error without opening payment', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.route('**/api/checkout**', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Checkout is temporarily unavailable.' }),
      }),
    );

    await page.goto('/products/nova-halo-ring');
    await page.getByRole('button', { name: /^Add to Bag/ }).first().click();
    await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    await fillSyntheticCheckoutDetails(page);
    await page.getByRole('button', { name: /Proceed to Atelier Settlement/i }).click();

    await expect(
      page.locator('[role="alert"]').filter({ hasText: 'Checkout is temporarily unavailable.' }),
    ).toBeVisible();
    await expect(page.getByText(/Authorize Atelier Commission/)).not.toBeVisible();
  });

  test('payment verification failure never displays payment success', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.route('**/api/checkout**', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          number: 'ARG-E2E-0002',
          accessToken: 'e2e-order-access-token',
        }),
      }),
    );
    await page.route('**/api/payments/razorpay/order/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          razorpayOrderId: 'order_e2e_failure',
          amount: 1000,
          keyId: 'rzp_test_e2e',
        }),
      }),
    );
    await page.route('**/api/payments/razorpay/verify', (route) =>
      route.fulfill({
        status: 402,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Payment could not be verified in this test.',
        }),
      }),
    );

    // Replace only the browser-side provider launcher. No provider session or
    // card/UPI data is created; the app still performs its real verification
    // request and renders the real failure state.
    await page.addInitScript(() => {
      class FakeRazorpay {
        private readonly options: {
          handler: (response: Record<string, string>) => Promise<void> | void;
        };

        constructor(options: {
          handler: (response: Record<string, string>) => Promise<void> | void;
        }) {
          this.options = options;
        }

        open() {
          void this.options.handler({
            razorpay_order_id: 'order_e2e_failure',
            razorpay_payment_id: 'pay_e2e_failure',
            razorpay_signature: 'signature_e2e_failure',
          });
        }
      }

      (window as unknown as { Razorpay: typeof FakeRazorpay }).Razorpay = FakeRazorpay;
    });

    await page.goto('/products/nova-halo-ring');
    await page.getByRole('button', { name: /^Add to Bag/ }).first().click();
    await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
    await fillSyntheticCheckoutDetails(page);
    await page.getByRole('button', { name: /Proceed to Atelier Settlement/i }).click();

    await expect(page.getByRole('heading', { name: 'Authorize Atelier Commission' })).toBeVisible();
    await page.getByRole('button', { name: /Authorize Atelier Commission of/ }).click();

    await expect(
      page
        .locator('[role="alert"]')
        .filter({ hasText: 'Payment verification failed. No order confirmation was issued.' }),
    ).toBeVisible();
    await expect(page.getByText('COMMISSION OFFICIALLY AUTHORIZED')).not.toBeVisible();
    await expect(page.getByText(/Your solid 925 sterling silver commission has been officially confirmed/)).not.toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
  });

  test('tracking validates email input before requesting an order', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/track');

    const email = page.locator('#trackEmail');
    await email.fill('not-an-email');
    await page.getByRole('button', { name: /Track Order Status/i }).click();

    await expect(email).toHaveJSProperty('validity.valid', false);
    await expect(page.getByText(/No order found matching/)).not.toBeVisible();
  });

  test('tracking shows the generic mismatch error for a valid request', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.route('**/api/orders/track**', (route) =>
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Not found' }),
      }),
    );
    await page.goto('/track');

    await page.locator('#orderNum').fill('ARG-E2E-0001');
    await page.locator('#trackEmail').fill('tracking-e2e@example.invalid');
    await page.getByRole('button', { name: /Track Order Status/i }).click();

    await expect(page.getByText(/No order found matching this order number/i)).toBeVisible();
  });

  test('order deed requires a valid access token and does not expose private details', async ({ page }) => {
    await useOfflineFallbacks(page);

    await page.goto('/orders/ARG-E2E-0001');
    await expect(page).toHaveURL(/\/track\?orderNumber=ARG-E2E-0001$/);
    await expect(page.getByRole('heading', { name: 'Track Your Order' })).toBeVisible();

    await page.goto('/orders/ARG-E2E-0001?t=invalid-e2e-token');
    await expect(page).toHaveURL(/\/track\?orderNumber=ARG-E2E-0001$/);
    await expect(page.getByRole('heading', { name: 'Track Your Order' })).toBeVisible();
    await expect(page.getByText(/Commission #ARG-E2E-0001/)).not.toBeVisible();
    await expect(page.getByText(/Client Details/)).not.toBeVisible();
  });

  test('mobile navigation opens and reaches the catalogue', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await useOfflineFallbacks(page);
    await page.goto('/');

    await page.getByRole('button', { name: 'Open menu' }).click();
    const navigation = page.getByRole('dialog', { name: 'Mobile Navigation' });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Shop All Pieces' })).toBeVisible();

    await navigation.getByRole('link', { name: 'Shop All Pieces' }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test('keyboard focus starts at the skip link and enters primary navigation', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/');

    const skipLink = page.locator('a[href="#main-content"]');
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.locator('nav[aria-label="Main Navigation"] button').first()).toBeFocused();
  });

  test('homepage has no critical or serious axe violations', async ({ page }) => {
    await useOfflineFallbacks(page);
    await page.goto('/');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const highImpactViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(highImpactViolations, JSON.stringify(highImpactViolations, null, 2)).toEqual([]);
  });
});

test.describe('robots, sitemap and indexing boundaries', () => {
  test('staging/non-production robots disallow crawling and sitemap stays empty', async ({ request }) => {
    test.skip(expectedEnvironment === 'production', 'Run this expectation against staging/non-production.');

    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toMatch(/User-agent:\s*\*/i);
    expect(robotsBody).toMatch(/Disallow:\s*\//i);
    expect(robotsBody).not.toMatch(/^Allow:\s*\//im);
    expect(robotsBody).not.toMatch(/Sitemap:/i);
    expect(robots.headers()['x-robots-tag'] || '').toMatch(/noindex/i);

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain('<urlset');
    expect(sitemapBody).not.toContain('<url>');
    expect(sitemapBody).not.toContain('/shop');
  });

  test('production robots allow public pages and sitemap excludes private flows', async ({ request }) => {
    test.skip(expectedEnvironment !== 'production', 'Run this expectation against production.');

    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toMatch(/User-agent:\s*\*/i);
    expect(robotsBody).toMatch(/^Allow:\s*\//im);
    expect(robotsBody).toMatch(/Disallow:\s*\/api\//i);
    expect(robotsBody).toMatch(/Disallow:\s*\/admin/i);
    expect(robotsBody).toContain('Sitemap: https://argyros-yw1l.vercel.app/sitemap.xml');
    expect(robots.headers()['x-robots-tag'] || '').not.toMatch(/noindex/i);

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain('<urlset');
    expect(sitemapBody).toContain('https://argyros-yw1l.vercel.app/');
    expect(sitemapBody).toContain('https://argyros-yw1l.vercel.app/shop');
    expect(sitemapBody).not.toMatch(/\/(?:checkout|track|orders|admin|account)(?:[<\/])/i);
  });
});

test.describe('owner/admin shell', () => {
  test('unauthenticated visitors are denied access to /admin', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await useOfflineFallbacks(page);
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
    await expect(page.getByText('You do not have permission to access the admin area.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Login' })).toHaveAttribute('href', '/login');
    await expect
      .poll(() => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)))
      .toBeLessThanOrEqual(390);
  });

  test('authenticated mobile admin navigation traps focus and fits the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await useMockAdminSession(page);
    await page.goto('/admin');

    const menuButton = page.getByRole('button', { name: 'Open admin menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const navigation = page.getByRole('dialog', { name: 'Mobile admin navigation' });
    const closeButton = navigation.getByRole('button', { name: 'Close admin menu' });
    await expect(navigation).toBeVisible();
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(navigation.getByRole('link', { name: 'Dashboard' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(navigation).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)))
      .toBeLessThanOrEqual(390);
  });
});
