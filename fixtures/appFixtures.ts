import { test as base, expect } from '@playwright/test';
import { POManager } from '../pages/POManager';
import { HomePage } from '../pages/HomePage';
import { SimpleFormDemoPage } from '../pages/SimpleFormDemoPage';
import { DragDropSliderPage } from '../pages/DragDropSliderPage';
import { analyzeFailure } from '../ai/failureAnalyzer';

type AppFixtures = {
  poManager: POManager;
  homePage: HomePage;
  simpleFormDemoPage: SimpleFormDemoPage;
  dragDropSliderPage: DragDropSliderPage
};

export const test = base.extend<AppFixtures>({
  poManager: async ({ page }, use) => {
    await page.goto('/selenium-playground');
    await expect(page).toHaveTitle(
      /Selenium Grid Online | Run Selenium Test On Cloud/
    );

    const poManager = new POManager(page);
    await use(poManager);
  },

  homePage: async ({ poManager }, use) => {
    await use(poManager.getHomePage());
  },

  simpleFormDemoPage: async ({ poManager }, use) => {
    await use(poManager.getSimpleFormPage());
  },

  dragDropSliderPage: async function({ poManager } ,use)
  {
    await use(poManager.getDragDropSliderPage())
  }

  
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const errorMessage =
      testInfo.error?.message || 'Unknown Playwright error';

    const aiAnalysis = await analyzeFailure(
      errorMessage,
      page.url()
    );

    console.log('\n🤖 AI Failure Analysis');
    console.log('────────────────────────');
    console.log(aiAnalysis);
  }
});

export { expect };
