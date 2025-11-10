import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración de Playwright para tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",

  // Tiempo máximo de ejecución por test
  timeout: 30 * 1000,

  // Configuración de expect
  expect: {
    timeout: 5000,
  },

  // Configuración de ejecución
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ["html"],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],

  // Configuración compartida para todos los tests
  use: {
    // URL base de la aplicación
    baseURL: "http://localhost:5173",

    // Captura de screenshots y videos solo en fallos
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Trace en fallos
    trace: "on-first-retry",

    // Timeout para acciones
    actionTimeout: 10000,

    // Navegación timeout
    navigationTimeout: 15000,
  },

  // Configurar proyectos para diferentes navegadores
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Tests para móviles
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },

    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    // Proyecto separado para tests de API
    {
      name: "api",
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: "http://localhost:3001",
      },
    },
  ],

  // Servidores gestionados por Playwright
  // - En local: arranca el frontend (Vite)
  // - En CI: arranca el backend NestJS para los tests de API
  webServer: (process.env.CI || process.env.PW_API)
    ? {
        command: "npm run start:dev",
        url: "http://localhost:3001/api",
        reuseExistingServer: true,
        timeout: 120 * 1000,
        cwd: "../backend",
        env: {
          PORT: "3001",
          AUTH_MOCK: "true",
          NODE_ENV: "test",
          // Debe tener >=32 chars y no ser el valor por defecto
          JWT_SECRET:
            "pw_test_jwt_secret_1234567890_ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
      }
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
