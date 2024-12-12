import { Page, expect, Locator } from '@playwright/test';
import { dataStore } from '../utils/DataStore';
import path from 'path';

export class ImageCreatePage {

    constructor(private page: Page) {}

    async verifyPageHeading(headingMsg: string) {
        const textElm = this.page.getByRole('heading', { name: headingMsg.toUpperCase() });
        await expect(textElm).toBeVisible({ timeout: 10000 });
    }

    async fillInputToTextBox(input: string) {
        // fill in the prompt
        const textBox = this.page.getByRole('textbox', { name: 'Scrambler Ducati [Insert your description here]' });
        await textBox.fill(input);
    }

    async clickOnButton(buttonName: string) {
        // identify button and click
        await this.page.getByRole('button', { name: buttonName, exact: true }).click();
    }

    async waitUntilImageIsCreated(timeoutInMilliseconds: number) {
        // wait until generation process is completed
        const heading = await this.page.getByRole('heading', { name: 'PICK YOUR FAVOURITE GENERATIONS' }).waitFor({ timeout: timeoutInMilliseconds });
    }

    async verifyImageCountOnPage(expectedCount: number) {
        // retrive image elements and check their counts
        const images = this.page.getByRole('button', { name: 'generated image' });

        // Get the image count
        const actualCount = await images.count();

        // Assert if actual count matches the expecte one
        expect(actualCount).toBe(expectedCount);
    }

    async verifyImagesHasBeenGenerate() {
        const heading = this.page.getByRole('heading', { level: 1, name: 'PICK YOUR FAVOURITE GENERATIONS' });
        await expect(heading).toBeVisible();
    }

    async enterUserDetails(userDetails: any = {}) {
        // Identify all locators on the page
        const firstNameTextbox = this.page.getByRole('textbox', { name: 'First Name' });
        const lastNameTextbox = this.page.getByRole('textbox', { name: 'Last Name' });
        const emailTextbox = this.page.getByRole('textbox', { name: 'Email' });
        const countrySelectionList = this.page.getByRole('combobox', { name: 'Select Country' });

        await firstNameTextbox.fill(userDetails.firstName);
        await lastNameTextbox.fill(userDetails.lastName);
        await emailTextbox.fill(userDetails.email);

        // Select the option with the value equal to country
        await countrySelectionList.click();
        await this.page.getByLabel(userDetails.country).getByText(userDetails.country).click();

        await this.page.getByLabel('for marketing activities via').click();
        await this.page.getByLabel('to understand your').click();
    }

    async selectImage(imageIndex: number = 1) {
        // Locate all image buttons with the role 'button' and name 'generated image'
        const imageObjects = this.page.getByRole('button', { name: 'generated image' });
        const count = await imageObjects.count();
        let selectImage: Locator;
        if (imageIndex <= count) {
            if (imageIndex > 0) {
                selectImage = imageObjects.nth(imageIndex);
            } else {
                selectImage = imageObjects.first();
            }
        } else {
            throw new Error(`Image with index: ${imageIndex} is not found`);
        }
        await selectImage.focus();
        await selectImage.click();
    }

    async clickNextButton() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async clickDownloadButton() {
        // register for download event
        const downloadPromise = this.page.waitForEvent('download');
        // trigger download event
        await this.page.getByRole('button', { name: 'DOWNLOAD' }).click();

        // wait for download completion
        const download = await downloadPromise;

        // save the downloaded file
        const downloadPath = dataStore.get("downloadPath");
        const imagePath = path.join(downloadPath, download.suggestedFilename());
        dataStore.set("imagePath", imagePath);
        await download.saveAs(imagePath);
    }
}