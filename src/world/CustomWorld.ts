
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import logger from '../logger/Logger';

export class CustomWorld extends World {
  page: Page;
  browser: Browser;
  browserContext: BrowserContext;
  browserType: string | null;

  constructor(options: any) {
    super(options);
    const { browser } = options.parameters || {};
    this.browserType = browser || null;
    this.browser = null!;
    this.browserContext = null!;
    this.page = null!;
    logger.info(`Option parameters recevied: ${JSON.stringify(options.parameters)}`);
  }
}