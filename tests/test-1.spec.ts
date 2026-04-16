import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://codezy.io.vn/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: ' Accounts' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  await page.getByRole('button', { name: ' All' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  await page.getByRole('button', { name: ' All' }).click();
});