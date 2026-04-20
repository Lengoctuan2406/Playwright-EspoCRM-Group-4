import { test as setup } from '@playwright/test';
import { CONFIG } from "../../playwright.config";
import { LoginPage } from "../pages/LoginPage";
import { isSessionValid } from "../../src/utils/Core";

setup.use({
    headless: true, // Chạy không bật browser
    viewport: { width: 1280, height: 720 },
    launchOptions: {
        slowMo: 0, // Không làm chậm thao tác để tối ưu tốc độ
    },
});

setup('Đăng nhập hệ thống và lưu Session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    if (!isSessionValid()) {
        await loginPage.login(process.env.PAGE_ADMIN_PASSWORD!, process.env.PAGE_ADMIN_USERNAME!);
        await page.context().storageState({ path: CONFIG.COMMON.STORAGE_PATH });
    }
});