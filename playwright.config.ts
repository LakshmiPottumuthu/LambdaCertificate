import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "Local Chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "Local Firefox",
      use: { ...devices["Desktop Firefox"] }
    }
  ]
});

