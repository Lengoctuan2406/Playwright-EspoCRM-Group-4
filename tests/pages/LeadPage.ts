import { LoginPage } from './LoginPage';

export class LeadPage extends LoginPage {
  async navigateToLead() {
    await this.page.goto(`${process.env.BASE_URL}/#Lead`);
  }
  async loginAndRedirectToLead(username: string, password: string) {
    await this.login(username, password);
    await this.navigateToLead();
  }
}
