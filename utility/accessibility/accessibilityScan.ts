import AxeBuilder from "@axe-core/playwright";

  export async function runAccessibilityScan(page) {
    return await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa']) // WCAG 2.0 AAA
      .analyze();
  }