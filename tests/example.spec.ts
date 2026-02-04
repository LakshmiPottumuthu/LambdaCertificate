import { test, expect} from "../fixtures/appFixtures";
import { faker } from "@faker-js/faker";
import { URLConstants } from "../utility/constants/URLConstants";

test.beforeEach("Navigate to application",async({page})=>{

   await page.goto('/');
   await page.goto('/selenium-playground');
   await expect(page).toHaveTitle(
         /Selenium Grid Online | Run Selenium Test On Cloud/
       );

});
test("home", async ({ page, homePage, simpleFormDemoPage }) => {
  const message = "Welcome to LambdaTest";

  await expect(page).toHaveScreenshot("home.png", {
    mask: homePage.getVisualMask()
  });
  await homePage.simpleFormDemoLink.click();
 

  await expect(page).toHaveURL(URLConstants.SIMPLE_FORM_DEMO_URL);
  await simpleFormDemoPage.messageInputBox.fill(message);
  await simpleFormDemoPage.showInputButton.click();
});

test("Test Scenario 2", async ({ page, homePage, dragDropSliderPage }) => {
  await homePage.dragAndDropSlidersLink.click();

  await expect(page).toHaveURL(URLConstants.DRAG_DROP_SLIDER_DEMO_URL);

  await expect(dragDropSliderPage.sliderText).toHaveText("Default value 15");
  await dragDropSliderPage.slider.fill("95");

  await expect(dragDropSliderPage.sliderSuccess).toHaveText("95");
});

test("Test Scenario 3", async ({ page, homePage }) => {
  await homePage.inputFormSubmitLink.click();

  await expect(page).toHaveURL("/selenium-playground/input-form-demo/");

  await page.locator('button[type="submit"]').nth(1).click();

  await expect(page.locator("#name")).toHaveJSProperty(
    "validationMessage",
    "Please fill out this field."
  );

  const fieldData = {
    "#name": faker.person.fullName(),
    "#inputEmail4": faker.internet.email(),
    "#inputPassword4": faker.internet.password(),
    "#company": "Lambda Test",
    "#websitename": faker.internet.domainName(),
    "#inputCity": faker.location.city(),
    "#inputAddress1": faker.location.streetAddress(),
    "#inputAddress2": faker.location.secondaryAddress(),
    "#inputState": faker.location.state(),
    "#inputZip": faker.location.zipCode(),
  };

  for (const [selector, value] of Object.entries(fieldData)) {
    await page.locator(selector).fill(value);
  }

  await page.locator('select[name="country"]').selectOption({ label: "India" });

  await page.locator('button[type="submit"]').nth(1).click();

  await expect(
    page.getByText("Thanks for contacting us, we will get back to you shortly.")
  ).toBeVisible();
});


test.afterEach(async ({ page }, testInfo) => {
  const status = testInfo.status === "passed" ? "PASSED" : "FAILED";
  const remark = testInfo.error?.message || "Test completed";

  await page.evaluate(
    ({ title, status, remark }) => {
      // LambdaTest injects LT_STATUS ONLY IF capabilities are correct
      // @ts-ignore
      if (window.LT_STATUS) {
        // @ts-ignore
        LT_STATUS.updateSession({
          name: title, // Test case name → visible in LT UI
          status, // PASSED / FAILED
          remark, // Error message or "Test completed"
        });
      }
    },
    { title: testInfo.title, status, remark }
  );
});
