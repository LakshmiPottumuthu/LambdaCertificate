import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // Windows Chrome
    {
      name: 'Windows-Chromium',
      use: {
        browserName: 'chromium',

        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify({
              browserName: 'chrome',
              browserVersion: 'latest',
              platform: 'Windows 11',

              user: process.env.LT_USERNAME,
              accessKey: process.env.LT_ACCESS_KEY,

              build: "Playwright Assignment Build",
              name: "Playwright Session",

              network: true,
              console: true,
              video: true,
              screenshot: true,
              visual: true
            })
          )}`
        }
      }
    },

    // Mac Firefox
    {
      name: 'Mac-Firefox',
      use: {
        browserName: 'chromium',

        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify({
              browserName: 'pw-firefox',
              browserVersion: 'latest',
              platform: 'macOS Monterey',

              user: process.env.LT_USERNAME,
              accessKey: process.env.LT_ACCESS_KEY,

              build: "Playwright Assignment Build",
              name: "Playwright Session",

              network: true,
              console: true,
              video: true,
              screenshot: true,
              visual: true
            })
          )}`
        }
      }
    }
  ]
});
