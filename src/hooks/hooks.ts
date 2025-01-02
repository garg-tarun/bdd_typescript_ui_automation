import { Before, After, setDefaultTimeout, Status, setWorldConstructor } from '@cucumber/cucumber';
import { createDirectory } from '../utils/TestUtility';
import { CustomWorld } from '../world/CustomWorld';
import { dataStore } from '../utils/DataStore';
import { BrowserManager } from '../utils/BrowserManager';
import logger from '../logger/Logger';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const env = dotenv.config({ path: './env/.env' });
const TestConfig = {
    headless: env.parsed?.HEADLESS === 'true',
    browser: env.parsed?.AUTOMATION_BROWSER || 'chromium',
    width: env.parsed?.BROWSER_WIDTH || '1920',
    height: env.parsed?.BROWSER_HEIGHT || '1080',
}

// Register the CustomWorld class
setWorldConstructor(CustomWorld);
// Set global default timeout to 10 minutes
const globalTimeoutInMS = process.env.GLOBAL_TIMEOUT ? +process.env.GLOBAL_TIMEOUT : 600 * 1000;
setDefaultTimeout(globalTimeoutInMS);

// Set up the browser for each scenario
Before(async function (this: CustomWorld, {pickle}) {
    const mgr = new BrowserManager(TestConfig);
    // Launch browser
    this.browser = await mgr.launchBrowser(this.browserType);
    logger.info(`Command line input browser type : ${this.browserType}`);

    // setup downloads directory for image download
    const scenarioName = pickle.name.replace(/[^a-z0-9]/gi, '_');
    const videos = createDirectory(`videos/${scenarioName}`);
    dataStore.set("videos", videos);

    // Create new browser context
    this.browserContext = await this.browser.newContext(
        {
            recordVideo: {
                dir: videos, // Directory to save videos
                size: { width: 1280, height: 720 }, // Video resolution
            },
            acceptDownloads: true,
            ignoreHTTPSErrors: true
        }
    );
    // Create a new page
    this.page = await this.browserContext.newPage();
    await this.page.setViewportSize({ width: +TestConfig.width, height: +TestConfig.height });

    // setup downloads directory for image download
    const downloadPath = createDirectory("downloads");
    dataStore.set("downloadPath", downloadPath);
})

// Closing the browser after scenario execution & take snapshot in case of failure
After(async function (this: CustomWorld, { pickle, result }) {

    const videoPath = await this.page.video()?.path();
    if (videoPath) {
        const video = fs.readFileSync(videoPath);
        // Attach video to the report
        this.attach(video, 'video/mp4');
    }

    if (result?.status === Status.FAILED) {
        if (this.page) {
            const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
            const image = await this.page.screenshot({
                path: screenshotPath,
                type: 'png',
            });
            this.attach(image, 'image/png');
        } else {
            console.error('this.page is not initialised');
        }
    }

    this.page.close();
    this.browser.close();
})
