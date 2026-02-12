import { test, expect } from "../fixtures/appFixtures";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Runs the k6 performance runner that lives in /performance.
 * Uses the PerformancePage fixture (POM) to supply BASE_URL and credentials.
 */
test("performanceTests: run k6 scenario and generate report", async ({
  performancePage,
}) => {
  const repoRoot = path.resolve(__dirname, "..");
  const runner = path.resolve(repoRoot, "performance", "run_k6.sh");
  const outDir = path.resolve(repoRoot, "performance", "results");
  const jsonPath = path.join(outDir, "result.json");
  const htmlPath = path.join(outDir, "report.html");

  // Ensure runner exists
  expect(fs.existsSync(runner)).toBeTruthy();

  // Prepare environment for runner using POM helpers
  const env = {
    ...process.env,
    BASE_URL: performancePage.baseUrl(),
    TEST_USER: performancePage.testUser(),
    TEST_PASS: performancePage.testPass(),
  };

  // Execute the performance runner (CI should provide k6 or Docker)
  execSync(`bash "${runner}"`, {
    stdio: "inherit",
    env,
    timeout: 10 * 60 * 1000,
  });

  // Validate output
  expect(fs.existsSync(jsonPath)).toBeTruthy();
  expect(fs.statSync(jsonPath).size).toBeGreaterThan(0);

  if (fs.existsSync(htmlPath)) {
    expect(fs.statSync(htmlPath).size).toBeGreaterThan(0);
  }
});
