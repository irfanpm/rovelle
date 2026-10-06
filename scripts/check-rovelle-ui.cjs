// Read-only storefront regression checks. Uses an isolated browser context and
// never creates users, submits orders, charges payments or mutates admin data.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.ROVELLE_QA_URL || 'http://localhost:3011';
const output = path.join(process.cwd(), 'private', 'rovelle-qa');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.ROVELLE_QA_BROWSER ? { executablePath: process.env.ROVELLE_QA_BROWSER } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await context.request.get(base + '/api/products');
  assert.equal(response.status(), 200);
  const { products } = await response.json();
  assert.equal(products.length, 16, 'Original published catalog must stay available');
  assert(!/supplierUrl|costPrice|internalNotes|margin|profit/.test(JSON.stringify(products)));
  const simple = products.find(p => !p.variants.length && p.stockStatus === 'in_stock');
  const variant = products.find(p => p.variants.length && p.stockStatus === 'in_stock');
  const routes = ['/', '/products', '/products?category=necklaces', '/categories', '/cart', '/wishlist', '/checkout', '/about', '/support', '/shipping', '/login', '/register', '/products/' + simple.slug];
  const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1600];
  const layout = [];
  try {
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => document.fonts.ready);
        const measure = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, brokenImages: Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length }));
        layout.push({ route, ...measure });
        assert(measure.width <= width + 1, route + ' overflows at ' + width + 'px: ' + measure.width);
        assert.equal(measure.brokenImages, 0, route + ' has broken images');
        if (route === '/' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, 'home-' + width + '.png'), fullPage: true });
        if (route === '/products' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, 'catalog-' + width + '.png'), fullPage: true });
      }
      console.log('Responsive checks passed: ' + route);
    }
    await page.goto(base + '/products?new=1&edit=jewellery', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.product-card').count(), 0, 'Jewellery New Arrivals must not include the existing children’s catalog');
    assert(await page.getByRole('heading', { name: 'Something beautiful is on its way.' }).isVisible());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    assert(await page.getByRole('dialog', { name: 'Main navigation' }).isVisible());
    await page.keyboard.press('Escape');
    assert(!(await page.getByRole('dialog', { name: 'Main navigation' }).isVisible()));
    await page.getByRole('button', { name: 'Search jewellery', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search the collection' }).fill('pouch');
    await page.locator('.search-results a').first().waitFor();
    assert((await page.locator('.search-results').innerText()).includes('Pouch'));
    await page.keyboard.press('Escape');
    await page.goto(base + '/products', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    assert(await page.getByRole('dialog', { name: 'Collection filters' }).isVisible());
    await page.keyboard.press('Escape');
    await page.goto(base + '/products/' + variant.slug, { waitUntil: 'networkidle' });
    await page.locator('.buy-actions').getByRole('button', { name: 'Add to Bag' }).click();
    assert((await page.getByRole('status').first().innerText()).includes('choose an option'));
    await page.getByLabel('Choose Your Option').selectOption(variant.variants[0]);
    await page.locator('.buy-actions').getByRole('button', { name: 'Add to Bag' }).click();
    await page.goto(base + '/products/' + simple.slug, { waitUntil: 'networkidle' });
    await page.locator('.buy-actions').getByRole('button', { name: 'Add to Bag' }).click();
    await page.getByRole('button', { name: 'Save to wishlist' }).click();
    await page.goto(base + '/wishlist', { waitUntil: 'networkidle' });
    assert((await page.locator('.product-card').innerText()).includes(simple.title));
    await page.goto(base + '/cart', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.bag-row').count(), 2);
    assert((await page.locator('.bag-row').first().innerText()).includes(variant.variants[0]));
    await page.getByRole('button', { name: 'Increase ' + simple.title, exact: true }).click();
    assert.equal(await page.locator('.bag-row').last().locator('.quantity span').innerText(), '2');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.bag-row').last().locator('.quantity span').innerText(), '2');
    await page.screenshot({ path: path.join(output, 'cart-390.png'), fullPage: true });
    await page.getByRole('button', { name: 'Remove ' + simple.title, exact: true }).click();
    assert.equal(await page.locator('.bag-row').count(), 1);
    await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
    await page.getByRole('heading', { name: 'Checkout', exact: true }).waitFor();
    assert(await page.getByRole('button', { name: 'Confirm availability & total' }).isVisible());
    await page.screenshot({ path: path.join(output, 'checkout-390.png'), fullPage: true });
    for (const route of ['/admin', '/admin/products', '/admin/orders', '/admin/categories', '/admin/coupons', '/admin/settings', '/admin/sourcing', '/account']) {
      const r = await context.request.get(base + route, { maxRedirects: 0 });
      assert([302,303,307,308].includes(r.status()), 'Anonymous protected route must redirect: ' + route);
      assert(r.headers().location.includes('/login'));
    }
    const missing = await context.request.get(base + '/products/rovelle-missing-product');
    assert.equal(missing.status(), 404);
    assert.equal(errors.length, 0, 'Browser errors: ' + errors.join('; '));
    const report = { widths, routes, measurements: layout, apiProducts: products.length, browserErrors: errors, checks: ['jewellery-only New Arrivals', 'mobile menu and Escape', 'predictive search', 'mobile filter dialog', 'required variant', 'add to bag', 'wishlist', 'quantity update', 'cart persistence', 'remove line', 'checkout navigation', 'protected route redirects', 'missing product 404'], authenticatedMutations: 'Not run: no staging credentials; no production writes' };
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log('PASS: ' + layout.length + ' responsive measurements and storefront interactions.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
