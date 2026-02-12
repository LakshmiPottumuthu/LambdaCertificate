import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SimpleFormDemoPage } from "../pages/SimpleFormDemoPage";
import { DragDropSliderPage } from "../pages/DragDropSliderPage";
import { VisualHelper } from "../utility/visual/visual.helper";
import { LoginPage } from "../pages/LoginPage";
import { PerformancePage } from "../pages/PerformancePage";

export interface Fixtures {
  homePage: HomePage;
  simpleFormDemoPage: SimpleFormDemoPage;
  dragDropSliderPage: DragDropSliderPage;
  prepareVisual: () => Promise<void>;
  loginPage: LoginPage;
  performancePage: PerformancePage;
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    // Runs on every navigation (before app JS)
    await page.addInitScript(() => {
      window.addEventListener("load", () => {
        (window as any).removeObstructionsForTestIfNeeded?.();
      });
    });

    // Safety net before actions
    await page.addLocatorHandler(
      page.locator("body"),
      async () => {
        await page.evaluate(() =>
          (window as any).removeObstructionsForTestIfNeeded?.()
        );
      },
      { noWaitAfter: true }
    );

    await use(page);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  performancePage: async ({ page }, use) => {
    const performancePage = new PerformancePage(page);
    await use(performancePage);
  },

  simpleFormDemoPage: async ({ page }, use) => {
    const simpleFormDemoPage = new SimpleFormDemoPage(page);
    await use(simpleFormDemoPage);
  },
  dragDropSliderPage: async ({ page }, use) => {
    const dragDropSliderPage = new DragDropSliderPage(page);
    await use(dragDropSliderPage);
  },
  prepareVisual: [
    async ({ page }, use) => {
      await use(async () => {
        await VisualHelper.preparePage(page);
      });
    },
    { auto: true },
  ],
});

export { expect };