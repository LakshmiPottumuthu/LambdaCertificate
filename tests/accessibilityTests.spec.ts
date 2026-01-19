import { test, expect } from "../fixtures/appFixtures";
import { accessibilityPages } from "../pages/accessibilityPages";
import { AccessibilityReporter } from "../utility/accessibility-reporter";
import { runAccessibilityScan } from "../utility/accessibility/accessibilityScan";

const reporter = new AccessibilityReporter();

  
test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    reporter.clearTempFile();
});
test('Recurring Accessibility Scan – WCAG 2.0 AAA', async ({ page }) => {
    for (const p of accessibilityPages) {
      await page.goto(`${p.url}`);
  
      const results = await runAccessibilityScan(page);
  
      reporter.addReport({
        pageName: p.name,
        pageUrl: page.url(),
        timestamp: new Date().toISOString(),
        violations: results.violations,
        seriousCriticalCount: results.violations.filter(
          v => v.impact === 'serious' || v.impact === 'critical'
        ).length
      });
    }
  });

  

test.afterAll(async () => {
    reporter.generateHtmlReport();
    // Clean up temporary file
    reporter.cleanupTempFile();
});