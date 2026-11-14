import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Pruebas unitarias y de componentes (Vitest + Testing Library).
 * Las pruebas e2e viven en `e2e/` y corren con Playwright (`pnpm test:e2e`).
 *
 * La cobertura se publica en `coverage/lcov.info`, que es lo que lee SonarQube
 * (`sonar.javascript.lcov.reportPaths`). Las exclusiones de cobertura deben
 * coincidir con `sonar.coverage.exclusions` en `sonar-project.properties`.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@test': path.resolve(import.meta.dirname, 'test'),
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.tsx'],
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'e2e', '.next'],
    css: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    clearMocks: true,
    restoreMocks: true,
    env: {
      NEXT_PUBLIC_ENTORNO: 'Desarrollo',
      NEXT_PUBLIC_API_URL_DEVELOPMENT: 'http://api.test',
      NEXT_PUBLIC_WS_URL_DEVELOPMENT: 'http://ws.test',
      NEXT_PUBLIC_LOG_LEVEL_DEVELOPMENT: 'ALL',
      TZ: 'America/Bogota',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/types/**'],
    },
  },
});
