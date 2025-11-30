import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  timeout: 90000,
  use: {
    baseURL: "http://localhost:5000",
    trace: "on-first-retry",
    screenshot: {
      mode: "on",
      fullPage: true,
    },
    viewport: { width: 1920, height: 4000 },
    actionTimeout: 60000,
    deviceScaleFactor: 2,
  },

  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium",
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5000",
    reuseExistingServer: !process.env.CI,
  },
});
