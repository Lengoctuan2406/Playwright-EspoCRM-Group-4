import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('Login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  await expect(page).toHaveTitle(/EspoCRM/);
});
