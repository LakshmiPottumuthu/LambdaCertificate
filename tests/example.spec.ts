import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Test Scenario 1', async ({ page }, testInfo) => {

  await page.goto('https://www.lambdatest.com/selenium-playground');

  await expect(page).toHaveTitle(/Selenium Grid Online | Run Selenium Test On Cloud/);

  await page.getByRole('link', { name: 'Simple Form Demo' }).click();

  await expect(page).toHaveURL('https://www.lambdatest.com/selenium-playground/simple-form-demo');
  const message = "Welcome to LambdaTest";
  await page.getByPlaceholder('Please enter your Message').fill(message);
  await page.locator('#showInput').click();

  await expect(page.locator("//div[@id='user-message']//p").nth(0)).toHaveText(message);

});

test('Test Scenario 2', async ({ page }, testInfo) => {

  await page.goto('https://www.lambdatest.com/selenium-playground');

  // Click the Drag & Drop Sliders link.
  await page.getByRole('link', { name: 'Drag & Drop Sliders' }).click();

  await expect(page).toHaveURL('https://www.lambdatest.com/selenium-playground/drag-drop-range-sliders-demo');
  
  await expect(page.locator("//div[@id='slider3']/h4")).toHaveText('Default value 15');
  await page.locator('#slider3').getByRole('slider').fill('95');

  await expect(page.locator("#rangeSuccess")).toHaveText('95');

});

test('Test Scenario 3', async ({ page }, testInfo) => {

  await page.goto('https://www.lambdatest.com/selenium-playground');

  // Click the Input Form Submit link.
  await page.getByRole('link', { name: 'Input Form Submit' }).click();

  await expect(page).toHaveURL('https://www.lambdatest.com/selenium-playground/input-form-demo');
  
  await page.locator('button[type="submit"]').nth(1).click();


  await expect(page.locator('#name')).toHaveJSProperty(
    'validationMessage',
    'Please fill out this field.'
  );

  const fieldData = {
    '#name': faker.person.fullName(),
    '#inputEmail4': faker.internet.email(),
    '#inputPassword4': faker.internet.password(),
    '#company': 'Lambda Test',
    '#websitename': faker.internet.domainName(),
    '#inputCity': faker.location.city(),
    '#inputAddress1': faker.location.streetAddress(),
    '#inputAddress2': faker.location.secondaryAddress(),
    '#inputState': faker.location.state(),
    '#inputZip': faker.location.zipCode(),
  };
  
  for (const [selector, value] of Object.entries(fieldData)) {
    await page.locator(selector).fill(value);
  }

  await page.locator('select[name="country"]').selectOption({ label: 'India' });

  await page.locator('button[type="submit"]').nth(1).click();

  await expect(page.getByText("Thanks for contacting us, we will get back to you shortly.")).toBeVisible();

});
