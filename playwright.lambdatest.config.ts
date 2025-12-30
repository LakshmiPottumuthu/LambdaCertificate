import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const LT_USERNAME = process.env.LT_USERNAME;
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY;

function ltCaps(cap: any) {
  const caps = {
    ...cap,
    user: LT_USERNAME,
    accessKey: LT_ACCESS_KEY,

    build: "Playwright Assignment Build",
    name: "Playwright Test",

    network: true,
    console: true,
    video: true,
    screenshot: true,

    client: {
      name: "playwright",
      version: "1.40.0"   
    }
  };

  return {
    connectOptions: {
      wsEndpoint:
        `wss://cdp.lambdatest.com/playwright?capabilities=` +
        encodeURIComponent(JSON.stringify(caps)),
    },
  };
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",

  projects: [
    {
      name: "LT-Windows-Chrome",
      use: ltCaps({
        browserName: "pw-chromium",
        browserVersion: "latest",
        platform: "Windows 11",
      }),
    },

    {
      name: "LT-Mac-Firefox",
      use: ltCaps({
        browserName: "pw-firefox",
        browserVersion: "latest",
        platform: "macOS Monterey",
      }),
    }
  ]
});
