#!/usr/bin/env node
// One screenshot per level, for reviewing the blockout without running the game.
import { mkdirSync } from 'node:fs';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';

const PORT = 5175;
const SETTLE_MS = 2500;

mkdirSync('shots', { recursive: true });

const server = await createServer({ server: { port: PORT, strictPort: true } });
await server.listen();

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  for (let level = 1; level <= 6; level++) {
    await page.goto(`http://localhost:${PORT}/?level=${level}`);
    await page.waitForFunction((n) => window.ghost?.level === n, level);
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: `shots/level-${level}.png` });
    console.log(`shots/level-${level}.png`);
  }
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const phone = await mobile.newPage();
  mkdirSync('shots/mobile', { recursive: true });
  for (let level = 1; level <= 6; level++) {
    await phone.goto(`http://localhost:${PORT}/?level=${level}`);
    await phone.waitForFunction((n) => window.ghost?.level === n, level);
    await phone.waitForTimeout(SETTLE_MS);
    await phone.screenshot({ path: `shots/mobile/level-${level}.png` });
    console.log(`shots/mobile/level-${level}.png`);
  }
  await mobile.close();
} finally {
  await browser.close();
  await server.close();
}
