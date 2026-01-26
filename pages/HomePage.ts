import { Locator } from "@playwright/test";

export class HomePage
{
    readonly simpleFormDemoLink:Locator;
    readonly dragAndDropSlidersLink : Locator;
    readonly inputFormSubmitLink : Locator;

    constructor(page)
    {
        this.simpleFormDemoLink = page.getByRole('link', { name: 'Simple Form Demo' });
        this.dragAndDropSlidersLink = page.getByRole('link', { name: 'Drag & Drop Sliders' });
        this.inputFormSubmitLink = page.getByRole('link', { name: 'Input Form Submit' });
        
    }

    getVisualMask() {
        return [this.simpleFormDemoLink];
      }
}