import { expect } from '@playwright/test';
import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world/CustomWorld';
import logger from '../logger/Logger';

/* import page object modules */
import { HomePage } from '../page-objects/HomePage';
import { ImageCreatePage } from '../page-objects/ImageCreatePage';

Given("I am on the Ducati Scrambler website", async function (this:CustomWorld) {
    const homePage = new HomePage(this.page);
    const url = "https://hacktheicon.scramblerducati.com/";
    await homePage.navigate(url);
    logger.info(`Navigating to ${url}`);
});

When("I click {string}", async function (this:CustomWorld, buttonText: string) {
    logger.info(`Clicking button with text ${buttonText}`);
    if(buttonText === "Start to Create") {
        const homePage = new HomePage(this.page);
       await homePage.clickOnButton(buttonText);
    } else if(buttonText === "Submit") {
        const imageCreatePage = new ImageCreatePage(this.page);
        await imageCreatePage.clickOnButton(buttonText);
    }
});