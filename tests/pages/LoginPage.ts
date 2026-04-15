import { Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page
  private readonly userNameInput: Locator
  private readonly passwordInput: Locator
  private readonly loginButton: Locator
  constructor(page: Page) {
    this.page = page
    this.userNameInput = page.locator("input[id='field-userName']")
    this.passwordInput = page.locator("input[id='field-password']")
    this.loginButton = page.locator("button[id='btn-login']")
  }
  async login(username: string, password: string): Promise<void> {
    await this.page.goto(process.env.BASE_URL!, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    })
    await this.userNameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
