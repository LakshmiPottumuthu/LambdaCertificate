import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "./config/envLoader";


loadEnv();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers : 3,
  reporter: "html",
  use: {
    baseURL: process.env.BASEURL,
    headless: false, 
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

