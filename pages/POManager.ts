import { DragDropSliderPage } from "./DragDropSliderPage";
import { HomePage } from "./HomePage";
import { SimpleFormDemoPage } from "./SimpleFormDemoPage";

export class POManager{
    readonly homePage: HomePage;
    readonly simpleFormDemo: SimpleFormDemoPage;
    readonly dragDropSlider:DragDropSliderPage

    constructor(page)
    {
        this.homePage = new HomePage(page);
        this.simpleFormDemo = new SimpleFormDemoPage(page);
        this.dragDropSlider = new DragDropSliderPage(page);
    }

    getHomePage(): HomePage {
        return this.homePage;
      }
    
    getSimpleFormPage(): SimpleFormDemoPage{
        return this.simpleFormDemo;
    }  

    getDragDropSliderPage(): DragDropSliderPage
    {
        return this.dragDropSlider;
    }

}