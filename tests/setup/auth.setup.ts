import test from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test("Create authenticated storage session", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(
    process.env.USER_EMAIL!,
    process.env.USER_PASSWORD!
  );

  // ✅ Ensure login succeeded
  await page.waitForURL("**/dashboard");

  // ✅ Save storage state
  await page.context().storageState({
    path: "auth/user.storage.json"
  });
});
