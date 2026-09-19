import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium', channel: 'chrome',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
  },
  webServer: {
    command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run dev -- --host 127.0.0.1 --port 5173 --strictPort`,
    url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI,
  },
})
