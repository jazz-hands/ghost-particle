import { test, expect, type Page } from '@playwright/test';

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('#hud *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1);
      })
      .map((el) => el.className));
}

test('the device is detected as touch', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hud-layer')).toHaveClass(/hud-touch/);
});

test('every level fits the viewport', async ({ page }, testInfo) => {
  const errors = collectErrors(page);
  for (let n = 1; n <= 6; n++) {
    await page.goto(`/?level=${n}`);
    await expect.poll(() => page.evaluate(() => window.ghost.level)).toBe(n);
    await page.waitForTimeout(1500);
    expect(await overflowing(page), `level ${n}`).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`level-${n}.png`) });
  }
  expect(errors).toEqual([]);
});

test('cards say tap, and a tap continues', async ({ page }) => {
  await page.goto('/?level=2');
  const hint = page.locator('.hud-card-hint').first();
  await expect(hint).toHaveText('Tap to continue');
  const before = await page.locator('.hud-card-text').first().textContent();
  await page.locator('.hud-card').first().tap();
  await expect(page.locator('.hud-card-text').first()).not.toHaveText(before ?? '');
});

test('holding the stage charges the level 1 meter', async ({ page }) => {
  await page.goto('/?level=1');
  await expect(page.locator('.hud-prompt')).toHaveText('Hold anywhere');
  const box = (await page.locator('.hud-layer').boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await expect.poll(async () => {
    const w = await page.locator('.hud-meter-fill').evaluate((el) => (el as HTMLElement).getBoundingClientRect().width);
    return w;
  }, { timeout: 4000 }).toBeGreaterThan(0);
  await page.mouse.up();
});
