import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import {SimpleFormDemoPage} from "../pages/SimpleFormDemoPage"
import {DragDropSliderPage} from "../pages/DragDropSliderPage"

export const test = base.extend<{
 homePage : HomePage,
 simpleFormDemoPage : SimpleFormDemoPage,
 dragDropSliderPage : DragDropSliderPage;
}>({

 homePage : async({page},use) =>
 {
  const homePage = new HomePage(page);
  await use(homePage);

 },

 simpleFormDemoPage : async({page},use) =>
  {
   const simpleFormDemoPage = new SimpleFormDemoPage(page);
   await use(simpleFormDemoPage);
 
  },
  dragDropSliderPage : async ({page},use)=>
  {
    const dragDropSliderPage = new DragDropSliderPage(page);
    await use(dragDropSliderPage);
  }
})

export { expect };