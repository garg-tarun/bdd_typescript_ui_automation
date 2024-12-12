import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import {getImageResolution} from '../utils/TestUtility';
import { CustomWorld } from '../world/CustomWorld';
import {faker} from "@faker-js/faker";
import { dataStore } from '../utils/DataStore';
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

Then("I should see the {string} page", async function (this:CustomWorld, headingMsg: string) {
    logger.info(`Verifying, if ${headingMsg} message is visible on page`);
    const imageCreatePage = new ImageCreatePage(this.page);
    await imageCreatePage.verifyPageHeading(headingMsg);
});

Given("I am on the image creation page", async function (this:CustomWorld) {
    logger.info('Verifying, if user is on image creation page');
    // check if user is on image creation page
    const imageCreatePage = new ImageCreatePage(this.page);
    await imageCreatePage.verifyPageHeading('CREATE YOUR CUSTOM SCRAMBLER DUCATI');
});

When("I fill in the prompt and click {string}", async function (this:CustomWorld, buttonName) {
    logger.info('Fill in the prompt details and click on button');
    // fill in the prompt and click generate button
    const imageCreatePage = new ImageCreatePage(this.page);
    const randomString = faker.string.alpha({length:10, casing: 'lower'});
    await imageCreatePage.fillInputToTextBox(randomString);
    await imageCreatePage.clickOnButton(buttonName);
});

When("I wait for the generation process to complete", async function (this:CustomWorld) {
    logger.info('Waiting for image generation process to complete');
    // wait until generation process is completed
    const imageCreatePage = new ImageCreatePage(this.page);
    const waitTimeMS = 60 * 1000;
    await imageCreatePage.waitUntilImageIsCreated(waitTimeMS);
});

Then("I should see the 4 generated images", async function (this:CustomWorld) {
    logger.info('Verifying, user can see 4 images on page');
    // retrive image elements and check their counts
    const imageCreatePage = new ImageCreatePage(this.page);
    const expectedImageCount = 4;
    await imageCreatePage.verifyImageCountOnPage(expectedImageCount);
});

Given("the 4 images have been generated and are visible", async function (this:CustomWorld) {
    logger.info('Verifying, 4 images are generated & visible on page');
    const imageCreatePage = new ImageCreatePage(this.page);
    await imageCreatePage.verifyPageHeading('PICK YOUR FAVOURITE GENERATIONS');
});

When("I fill in my details and accept the terms", async function (this:CustomWorld) {
    logger.info('Fill in user details and accept the terms');
    const imageCreatePage = new ImageCreatePage(this.page);
    const userDetails = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        country: "Australia"
    };
    // Fill user details in the form
    await imageCreatePage.enterUserDetails(userDetails)
});

Then("I should be able to choose one of the 4 images", async function (this:CustomWorld) {
    const imageCreatePage = new ImageCreatePage(this.page);
    const imageIndex = 1;
    await imageCreatePage.selectImage(imageIndex);
    logger.info('User selects an image & click on next button');
    await imageCreatePage.clickNextButton();
    logger.info('User clicks on Download button');
    await imageCreatePage.clickDownloadButton();
});

Then("the resolution of the saved file should be 2056 x 1368", async function (this:CustomWorld) {
    logger.info('Verifying, downloaded image has 2056 x 1368 resolution');
    const imagePath = dataStore.get("imagePath");
    const actualResolution = await getImageResolution(imagePath);
    const expectedResolution = { width: 2056, height: 1368 };
    expect(actualResolution).toEqual(expectedResolution);
});