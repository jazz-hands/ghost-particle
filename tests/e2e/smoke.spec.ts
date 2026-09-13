import { test, expect, type Page } from '@playwright/test';

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test('boots without console errors and can create a WebGL context', async ({ page }, testInfo) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle('Ghost Particle');
  const webgl = await page.evaluate(() => {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  });
  expect(webgl).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('boot.png') });
  expect(errors).toEqual([]);
});

test('mounts a full-window canvas', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  const canvas = page.locator('#stage canvas');
  await expect(canvas).toHaveCount(1);
  const box = await canvas.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box?.width).toBe(viewport.width);
  expect(box?.height).toBe(viewport.height);
  expect(errors).toEqual([]);
});
