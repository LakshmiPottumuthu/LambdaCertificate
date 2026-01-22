import { Locator } from "@playwright/test";

export class SimpleFormDemoPage
{
   readonly  messageInputBox:Locator;
   readonly  showInputButton:Locator;
   readonly  userMessageText:Locator;
    constructor(page)
    {
        this.messageInputBox = page.getByPlaceholder('Please enter your Message');
        this.showInputButton = page.locator('#showInput');
        this.userMessageText = page.locator("//div[@id='user-message']//p");

    }


}