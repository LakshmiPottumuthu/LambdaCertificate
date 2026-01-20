import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "./config/envLoader";


loadEnv();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers : 3,
  reporter: [
    ['playwright-smart-reporter', {
      outputFile: 'smart-report.html',
      historyFile: 'test-history.json',
      maxHistoryRuns: 10,
      performanceThreshold: 0.2,
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
      teamsWebhook: process.env.TEAMS_WEBHOOK_URL,
      // Feature flags
      enableRetryAnalysis: true,
      enableFailureClustering: true,
      enableStabilityScore: true,
      enableGalleryView: true,
      enableComparison: true,
      enableAIRecommendations: true,
      enableTraceViewer: true,
      enableHistoryDrilldown: true,
      stabilityThreshold: 70,
      retryFailureThreshold: 3,
      baselineRunId: 'main-branch-baseline', // optional
    }],
  ],
  use: {
    baseURL: process.env.BASEURL,
    headless: false, 
   // trace: "on-first-retry",
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

