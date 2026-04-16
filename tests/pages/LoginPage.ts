import { Locator, Page } from "@playwright/test";

const LOCATORS = {
  userNameInput: "input[id='field-userName']",
  passwordInput: "input[id='field-password']",
  loginButton: "button[id='btn-login']",
};

export class LoginPage {
  protected readonly page: Page
  protected readonly userNameInput: Locator
  protected readonly passwordInput: Locator
  protected readonly loginButton: Locator
  constructor(page: Page) {
    this.page = page
    this.userNameInput = page.locator(LOCATORS.userNameInput);
    this.passwordInput = page.locator(LOCATORS.passwordInput);
    this.loginButton = page.locator(LOCATORS.loginButton);
  }
  async login(username: string, password: string): Promise<void> {
    await this.page.goto(process.env.PAGE_URL!, {
      waitUntil: 'domcontentloaded',
      timeout: parseInt(process.env.SETUP_TIMEOUT!)
    })
    await this.userNameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
