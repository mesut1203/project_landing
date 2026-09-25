import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'landing.spec.ts',
  globalSetup: './tests/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  outputDir: '.local/playwright-results',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5187',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    headless: true,
    reducedMotion: 'no-preference',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
})
