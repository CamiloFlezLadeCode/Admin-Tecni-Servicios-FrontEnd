import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas e2e (Playwright).
 *
 * Levanta su propio `next dev` en el puerto 3101 y en `.next-e2e`, así no choca
 * con un `pnpm dev` abierto en el 3001. La API apunta a un host ficticio
 * (`api.e2e.test`) y todas sus respuestas se simulan en `e2e/utilidades/api.ts`:
 * las pruebas nunca tocan el backend real ni dependen del `.env`.
 */
const PUERTO = 3101;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 90_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec next dev --port ${PUERTO}`,
    url: `http://localhost:${PUERTO}/auth/sign-in`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_DIST_DIR: '.next-e2e',
      NEXT_PUBLIC_ENTORNO: 'Desarrollo',
      NEXT_PUBLIC_API_URL_DEVELOPMENT: 'http://api.e2e.test',
      NEXT_PUBLIC_WS_URL_DEVELOPMENT: 'http://ws.e2e.test',
      NEXT_PUBLIC_LOG_LEVEL_DEVELOPMENT: 'ERROR',
    },
  },
});
