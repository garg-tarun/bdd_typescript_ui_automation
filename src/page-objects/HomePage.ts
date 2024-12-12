import { Page } from '@playwright/test';
import { CustomWorld } from '../world/CustomWorld';

export class HomePage {
  constructor(private page: Page) {}

  async navigate(url:string) {
    await this.page.goto(url);
    await this.page.getByRole('button', { name: 'Accept All Cookies' }).click();
  }

  async clickOnButton(buttonText:string) {
    await this.page.getByRole('link', { name: buttonText }).click();
  }
}