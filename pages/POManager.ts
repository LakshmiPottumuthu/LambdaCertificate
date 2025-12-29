import { HomePage } from "./HomePage";
import { SimpleFormDemo } from "./SimpleFormDemoPage";

export class POManager{
    readonly homePage: HomePage;
    readonly simpleFormDemo: SimpleFormDemo;

    constructor(page)
    {
        this.homePage = new HomePage(page);
        this.simpleFormDemo = new SimpleFormDemo(page);
    }

    getHomePage(): HomePage {
        return this.homePage;
      }
    
    getSimpleFormPage(): SimpleFormDemo{
        return this.simpleFormDemo;
    }  

}