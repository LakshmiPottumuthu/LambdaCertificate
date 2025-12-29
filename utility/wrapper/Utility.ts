import { Locator, Page, expect, request } from '@playwright/test';

export default class Utility {
    constructor(private page: Page) {}

    async checkRouteBeforeNavigation(url: string) {
        const context = await request.newContext({});
        const response = await context.get(url);
        expect(await response.text()).not.toContain('<title>ERROR 403 - Forbidden | Resume-Library.com</title>');
        expect(await response.text()).not.toContain('<title>ERROR 502 - Bad Gateway | Resume-Library.com</title>');
        expect(response.status()).not.toBe(502);
    }

    async clickOnLinks(locator: string, linkText: string) {
        const listOfLinks = this.page.locator(locator);
        for (let i = 0; i < (await listOfLinks.count()); i++) {
            if ((await listOfLinks.nth(i).textContent()) == linkText) {
                await listOfLinks.nth(i).click();
            }
        }
    }

    async verifyOptionSelected(locator: string, selectedText: string) {
        await expect(this.page.getByTestId(locator).locator('option[selected]')).toHaveText(selectedText);
    }

    async getcurrentTime() {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();
        return currentHour + ':' + currentMinute;
    }
    async getDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }
    getFormattedTodayDateForInput(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayStr = `${year}-${month}-${day}`;
        return todayStr;
    }
    getFormattedTodayDateForInputDDMMYYYY(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayStr = `${day}/${month}/${year}`;
        return todayStr;
    }

    

    
    // async setCookie(key: string, value: string) {
    //     await this.page.context().addCookies([{ name: key, value: value, url: await urlHelper.URL() }]);
    // }

    async deleteCookie(key: string) {
        const context = this.page.context();
        const allCookies = await context.cookies();
        const remainingCookies = allCookies.filter((cookie) => cookie.name !== key);
        await context.clearCookies();
        await context.addCookies(remainingCookies);
    }

    async getTextIfExists(locator, index) {
        if ((await locator.nth(index).count()) > 0) {
            return locator.nth(index).innerText();
        }
        return null;
    }


    async parseDateFromSavedText(text: string): Promise<Date> {
        const dateTimeStr = text.split(': ')[1]; // "14/05/2025 (17:51)"
        const [datePart, timePartWithParens] = dateTimeStr.split(' '); // ["14/05/2025", "(17:51)"]

        const [day, month, year] = datePart.split('/').map(Number); // [14, 05, 2025]
        const timePart = timePartWithParens.replace(/[()]/g, ''); // "17:51"
        const [hour, minute] = timePart.split(':').map(Number); // [17, 51]

        return new Date(year, month - 1, day, hour, minute);
    }

    async checkSuggestions(fieldValue: string, locator: string, count) {
        const suggestionMenu = this.page.locator(locator);
        await this.page.waitForSelector(locator);
        await suggestionMenu.waitFor({ state: 'visible' });

        const suggestions = await suggestionMenu.locator('li').allTextContents();
        if (suggestions.length > count) {
            throw new Error('Expected ' + count + ` suggestions, but found ${suggestions.length}`);
        }

        for (const suggestion of suggestions) {
            expect(suggestion.toLowerCase()).toContain(fieldValue.toLowerCase());
        }
    }
}
