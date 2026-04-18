import { test as setup } from '@playwright/test';
import { CONFIG } from "../../playwright.config";
import { LoginPage } from "../pages/LoginPage";
import { isSessionValid } from "../../src/utils/Core";

setup('Đăng nhập hệ thống', async ({ page }) => {
    const loginPage = new LoginPage(page);
    if (isSessionValid()) {
        // Session còn hạn thì bỏ qua bước đăng nhập
        return;
    }
    await loginPage.login(process.env.PAGE_ADMIN_PASSWORD!, process.env.PAGE_ADMIN_USERNAME!);
    await page.context().storageState({ path: CONFIG.COMMON.STORAGE_PATH });
});