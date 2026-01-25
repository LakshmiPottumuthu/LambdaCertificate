import { Page } from "@playwright/test";

export class VisualHelper {
  static async preparePage(page: Page) {
    // Disable animations & transitions
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `
    });
  }
}
