import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly logout: Locator;

  constructor(page: Page) {
    this.page = page;
    // resilient locators with fallbacks and data-test hooks
    this.username = page.locator('input[name="username"], input[name="email"], #username, [data-test="username"]');
    this.password = page.locator('input[name="password"], #password, [data-test="password"]');
    this.submit = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login"), [data-test="login-button"]');
    this.logout = page.locator('text=Logout, [data-test="logout"], button:has-text("Sign out")');
  }

  async goto() {
    // Uses baseURL if configured in playwright.config.ts when passing a path
    await this.page.goto("/login");
    // Wait for login form to be available
    await this.username.first().waitFor({ state: "visible", timeout: 5000 });
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
    // final guard: ensure logout (post-login indicator) is visible
    await this.logout.waitFor({ state: "visible", timeout: 10000 });
  }

  // Accessors used by the test for assertions
  usernameLocator() {
    return this.username;
  }
  passwordLocator() {
    return this.password;
  }
  submitLocator() {
    return this.submit;
  }
  logoutLocator() {
    return this.logout;
  }
}
