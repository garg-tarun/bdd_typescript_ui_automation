import { chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';
import logger from '../logger/Logger';

export class BrowserManager {
    private testConfig : Record<string, any>;

    constructor(testConfig:Record<string, any>) {
        this.testConfig = testConfig;
    }

    getBrowserType(browserName:string):BrowserType {
        const browserMap: { [key: string]: BrowserType } = {
            'chromium': chromium,
            'firefox': firefox,
            'webkit': webkit
        };
        return browserMap[browserName.toLowerCase()];
    }

    async launchBrowser(overwriteBrowserType:string|null): Promise<Browser> {
        let browserName:string;
        if(overwriteBrowserType) {
            browserName = overwriteBrowserType;
        } else {
            browserName = this.testConfig.browser;
        }
        logger.info(`Browser name: ${browserName}`);
        const launchBrowserType = this.getBrowserType(browserName); 
        if (!launchBrowserType) {
            throw new Error(`Invalid browser selected: ${this.testConfig.browser}`);
        }
        return await launchBrowserType.launch({ headless: this.testConfig.headless });
    }

}