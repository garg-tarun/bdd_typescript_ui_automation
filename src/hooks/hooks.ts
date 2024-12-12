import { Before, After, setDefaultTimeout, Status, setWorldConstructor } from '@cucumber/cucumber';
import {createDirectory} from '../utils/TestUtility';
import { CustomWorld } from '../world/CustomWorld';
import { dataStore } from '../utils/DataStore';
import { BrowserManager } from '../utils/BrowserManager';
import logger from '../logger/Logger';
import dotenv from 'dotenv';
const env = dotenv.config({path: './env/.env'});
const TestConfig = {
    headless: env.parsed?.HEADLESS === 'true',
    browser:  env.parsed?.AUTOMATION_BROWSER || 'chromium',
    width: env.parsed?.BROWSER_WIDTH || '1920',
    height: env.parsed?.BROWSER_HEIGHT || '1080',
}

// Register the CustomWorld class
setWorldConstructor(CustomWorld);
// Set global default timeout to 10 minutes
const globalTimeoutInMS = process.env.GLOBAL_TIMEOUT ? +process.env.GLOBAL_TIMEOUT : 600 * 1000;
setDefaultTimeout(globalTimeoutInMS);

// Set up the browser for each scenario
Before(async function (this:CustomWorld) {
    const mgr = new BrowserManager(TestConfig);
    // Launch browser
    this.browser = await mgr.launchBrowser(this.browserType);
    logger.info(`name : ${this.browserType}`);
    // Create new browser context
    this.browserContext = await this.browser.newContext(
        {
            acceptDownloads: true,
            ignoreHTTPSErrors: true
        }
    );
    // Create a new page
    this.page =  await this.browserContext.newPage();
    await this.page.setViewportSize({width: +TestConfig.width, height: +TestConfig.height});
   
    // setup downloads directory for image download
    const downloadPath = createDirectory("downloads");
    dataStore.set("downloadPath", downloadPath );
})

// Closing the browser after scenario execution & take snapshot in case of failure
After(async function (this:CustomWorld, { pickle, result }) {

    if (result?.status === Status.FAILED) {
        if (this.page) {
            const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
            const image = await this.page.screenshot({
                path: screenshotPath,
                type: 'png',
            });
            this.attach(image, 'image/png');
        } else {
            console.error('pageFixture.page is undefined');
        }
    }

    this.page.close();
    this.browser.close();
})