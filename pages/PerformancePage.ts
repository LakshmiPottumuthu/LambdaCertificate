import { Page } from "@playwright/test";

/**
 * PerformancePage - POM integration for performance tests.
 * Exposes endpoints and helpers that both Playwright tests and k6 runner can consume.
 */
export class PerformancePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Base URL used for performance tests - prefers env BASE_URL, otherwise fallback
  baseUrl(): string {
    return process.env.BASE_URL || "http://localhost:3000";
  }

  // Paths used by the k6 script / perf scenarios
  homepagePath(): string {
    return "/selenium-playground";
  }

  loginPath(): string {
    return "/login";
  }

  dashboardPath(): string {
    return "/dashboard";
  }

  // Expose credentials from env for convenience
  testUser(): string {
    return process.env.TEST_USER || process.env.E2E_USER || "";
  }
  testPass(): string {
    return process.env.TEST_PASS || process.env.E2E_PASS || "";
  }
}