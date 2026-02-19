import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',               // create this folder next
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,  // avoid flakiness in CI; adjust later
  reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',  // default Next.js dev
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm --filter=web dev', 
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});