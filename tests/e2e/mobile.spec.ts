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

// An element inside a scrolling box (the credits roll) is meant to extend past the viewport; the
// box itself clips it. An element still mid-CSS-animation (the level 6 counter's grow-in) can
// report a transient, pre-layout rect, so it is skipped too.
async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('#hud *')]
      .filter((el) => {
        for (let p: HTMLElement | null = el; p; p = p.parentElement) {
          if (p.getAnimations().some((a) => a.playState === 'running')) return false;
          if (p !== el && (getComputedStyle(p).overflowY === 'auto' || getComputedStyle(p).overflowY === 'scroll')) return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1);
      })
      .map((el) => el.className));
}

test('the device is detected as touch', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hud-layer')).toHaveClass(/hud-touch/);
});

// Beats within a level are advanced with window.ghost.next(); when a beat instead waits for a
// key press (e.g. level 3's steer), pressing Space through the touch-layer keyboard shim advances
// it the same way a tap would.
const MAX_BEATS_PER_LEVEL = 12;
const BEAT_WAIT_MS = 400;

test('every level fits the viewport', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors = collectErrors(page);
  for (let n = 1; n <= 6; n++) {
    await page.goto(`/?level=${n}`);
    await expect.poll(() => page.evaluate(() => window.ghost.level)).toBe(n);
    await page.waitForTimeout(1500);
    expect(await overflowing(page), `level ${n} beat 0`).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`level-${n}.png`) });

    for (let beat = 1; beat <= MAX_BEATS_PER_LEVEL; beat++) {
      const { level, finished } = await page.evaluate(() => ({
        level: window.ghost.level,
        finished: window.ghost.finished,
      }));
      if (finished || level !== n) break;
      await page.evaluate(() => window.ghost.next());
      await page.keyboard.press('Space');
      await page.waitForTimeout(BEAT_WAIT_MS);
      expect(await overflowing(page), `level ${n} beat ${beat}`).toEqual([]);
    }
    await page.screenshot({ path: testInfo.outputPath(`level-${n}-end.png`) });
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

test('holding the stage starts the level 1 charge', async ({ page }) => {
  await page.goto('/?level=1');
  await expect(page.locator('.hud-prompt')).toHaveText('Hold anywhere');
  const box = (await page.locator('.hud-layer').boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await expect(page.locator('.hud-prompt')).toHaveCount(0);
  await page.mouse.up();
});
