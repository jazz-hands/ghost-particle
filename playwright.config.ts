import { defineConfig, devices } from '@playwright/test';

const shared = {
  baseURL: 'http://localhost:5174',
  // Headless Chromium has no GPU; SwiftShader gives it a software WebGL context.
  launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
};

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  // Headless Chromium has no GPU here, so a level's render settle time is slow.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: shared,
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-landscape', use: { ...devices['Pixel 7 landscape'] } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5174 --strictPort',
    url: 'http://localhost:5174',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
