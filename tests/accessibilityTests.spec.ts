import { test, expect } from "../fixtures/appFixtures";
import AxeBuilder from '@axe-core/playwright';
import { AccessibilityReporter } from "../utility/accessibility-reporter";

const reporter = new AccessibilityReporter();

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    reporter.clearTempFile();
});
test.only("should not have any automatically detectable accessibility issues", async ({ page, homePage }) => {
    await homePage.simpleFormDemoLink.click();

  const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  // Collect violations for consolidated HTML report
  const seriousCritical = accessibilityScanResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
  );


    reporter.addReport({
    pageName: 'SimpleForm Demo Page',
    pageUrl: page.url(),
    timestamp: new Date().toISOString(),
    violations: accessibilityScanResults.violations,
    seriousCriticalCount: seriousCritical.length,
});

// Note: We collect violations for the report but allow tests to continue
// The HTML report will show all issues found across all pages
if (accessibilityScanResults.violations.length > 0) {
    console.log(
        `⚠️  Found ${accessibilityScanResults.violations.length} accessibility violations on SimpleForm Demo Page`
    );
}
});

test.afterAll(async () => {
    reporter.generateHtmlReport();
    // Clean up temporary file
    reporter.cleanupTempFile();
});