import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "./config/envLoader";


loadEnv();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers : 3,
  reporter: "html",
  // reporter: [
  //   ['playwright-smart-reporter', {
  //     outputFile: 'smart-report.html',
  //     historyFile: 'test-history.json',
  //     maxHistoryRuns: 10,
  //     performanceThreshold: 0.2,
  //     slackWebhook: process.env.SLACK_WEBHOOK_URL,
  //     teamsWebhook: process.env.TEAMS_WEBHOOK_URL,
  //     // Feature flags
  //     enableRetryAnalysis: true,
  //     enableFailureClustering: true,
  //     enableStabilityScore: true,
  //     enableGalleryView: true,
  //     enableComparison: true,
  //     enableAIRecommendations: true,
  //     enableTraceViewer: true,
  //     enableHistoryDrilldown: true,
  //     stabilityThreshold: 70,
  //     retryFailureThreshold: 3,
  //     baselineRunId: 'main-branch-baseline', // optional
  //   }],
  // ],
  use: {
    baseURL: process.env.BASEURL,
    headless: false, 
    //storageState: "auth/user.storage.json"
   // trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      pathTemplate: 'tests/visual-snapshots/{browser}/{testName}.png',
      threshold: 0.2, // pixel difference tolerance
      maxDiffPixelRatio: 0.01
    }
  },

  projects: [
    {
      name: "setup",
      testMatch: /global\.setup\.ts/

    },
    {
      name: 'cleanup',
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: "LocalChromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies : ["setup"],
    },
    {
      name: "Local Firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies : ["setup"],
    }
  ]
});

