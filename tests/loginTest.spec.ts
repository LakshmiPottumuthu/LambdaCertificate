import { test, expect } from "../fixtures/appFixtures";

/**
 * POIM login test that uses the shared fixtures.
 * Credentials come from env vars to avoid committing secrets.
 *
 * If TEST_USER / TEST_PASS are not set, the test will verify the login form is present
 * so the test remains executable as part of the full suite.
 */
const TEST_USER = process.env.TEST_USER || process.env.E2E_USER || "";
const TEST_PASS = process.env.TEST_PASS || process.env.E2E_PASS || "";

// Always use the framework test (so it is executed in the full suite).
test("loginTest: logs in with valid credentials or shows login form", async ({ loginPage }) => {
  // Navigate to login page
  await loginPage.goto();

  if (TEST_USER && TEST_PASS) {
    // Perform real login when credentials are provided
    await loginPage.login(TEST_USER, TEST_PASS);
    await expect(loginPage.logoutLocator()).toBeVisible();
  } else {
    // No credentials: verify login form exists (keeps the test part of the suite without secrets)
    await expect(loginPage.usernameLocator()).toBeVisible();
    await expect(loginPage.passwordLocator()).toBeVisible();
    await expect(loginPage.submitLocator()).toBeVisible();
  }
});
