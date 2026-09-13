import { test, expect, type Page } from '@playwright/test';
import type { GhostHook } from '../../src/debug/ghost.ts';

declare global {
  interface Window { ghost: GhostHook }
}

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

test('?level=N enters that level and window.ghost.skip() advances it', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?level=3');
  await expect.poll(() => page.evaluate(() => window.ghost.level)).toBe(3);
  await page.evaluate(() => window.ghost.skip());
  await expect.poll(() => page.evaluate(() => window.ghost.level)).toBe(4);
  expect(errors).toEqual([]);
});

test('every level renders and the run steps to the end', async ({ page }, testInfo) => {
  const errors = collectErrors(page);
  for (let n = 1; n <= 6; n++) {
    await page.goto(`/?level=${n}`);
    await expect.poll(() => page.evaluate(() => window.ghost.level)).toBe(n);
    await page.screenshot({ path: testInfo.outputPath(`level-${n}.png`) });
  }
  await page.evaluate(() => window.ghost.skip());
  await expect.poll(() => page.evaluate(() => window.ghost.finished)).toBe(true);
  expect(errors).toEqual([]);
});

test('debug tools mount only with ?debug (D-017)', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('.lil-gui')).toHaveCount(0);
  await page.goto('/?debug');
  await expect(page.locator('.lil-gui')).toHaveCount(1);
  expect(errors).toEqual([]);
});
