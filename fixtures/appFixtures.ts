import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import {SimpleFormDemoPage} from "../pages/SimpleFormDemoPage"
import {DragDropSliderPage} from "../pages/DragDropSliderPage"
import { VisualHelper } from "../utility/visual/visual.helper";

export interface Fixtures {
  homePage : HomePage,
  simpleFormDemoPage : SimpleFormDemoPage,
  dragDropSliderPage : DragDropSliderPage;
  prepareVisual: () => Promise<void>; 
}

export const test = base.extend<Fixtures>({

  page: async ({ page }, use) => {
    // Runs on every navigation (before app JS)
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        (window as any).removeObstructionsForTestIfNeeded?.();
      });
    });

    // Safety net before actions
    await page.addLocatorHandler(
      page.locator('body'),
      async () => {
        await page.evaluate(() =>
          (window as any).removeObstructionsForTestIfNeeded?.()
        );
      },
      { noWaitAfter: true }
    );

    await use(page);
  },
 homePage : async({page},use) =>
 {
  const homePage = new HomePage(page);
  await use(homePage);

 },

 simpleFormDemoPage : async({page},use) =>
  {
   const simpleFormDemoPage = new SimpleFormDemoPage(page);
   await use(simpleFormDemoPage);
 
  },
  dragDropSliderPage : async ({page},use)=>
  {
    const dragDropSliderPage = new DragDropSliderPage(page);
    await use(dragDropSliderPage);
  },
  prepareVisual: async ({ page }, use) => {
    await use(async () => {
      await VisualHelper.preparePage(page);
    });
  }
})

export { expect };