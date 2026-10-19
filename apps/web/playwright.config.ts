import { defineConfig, devices } from '@playwright/test';

// BASE_URL is the public contract for running this suite against an existing
// deployment. Keep E2E_BASE_URL as a backwards-compatible alias for the
// original local runbook.
const configuredBaseURL = process.env.BASE_URL || process.env.E2E_BASE_URL;
const baseURL = configuredBaseURL || 'http://127.0.0.1:3000';
const useExternalServer = Boolean(configuredBaseURL);
const appEnvironment =
  process.env.E2E_APP_ENV || process.env.APP_ENV || 'development';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  // When BASE_URL/E2E_BASE_URL is set, the target is already running (local or
  // deployed), so Playwright must not launch a second development server.
  webServer: useExternalServer
    ? undefined
    : {
        command: process.env.E2E_WEB_SERVER_COMMAND || 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          APP_ENV: appEnvironment,
          NEXT_PUBLIC_SITE_URL: process.env.E2E_SITE_URL || baseURL,
        },
    },
});
