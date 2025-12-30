import { Locator, Page } from "@playwright/test";

export class DragDropSliderPage
{
   
       readonly  page: Page;
       readonly  messageInputBox:Locator;
       readonly  showInputButton:Locator;
       readonly  sliderText:Locator;
       readonly  slider:Locator;
       readonly  sliderSuccess:Locator
        constructor(page)
        {
            this.page = page;
            this.messageInputBox = page.getByPlaceholder('Please enter your Message');
            this.showInputButton = page.locator('#showInput');
            this.sliderText = page.locator("//div[@id='slider3']/h4");
            this.slider = page.locator('#slider3').getByRole('slider');
            this.sliderSuccess =  page.locator("#rangeSuccess");
    
        }
}