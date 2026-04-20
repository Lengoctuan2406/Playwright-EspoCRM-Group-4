import { test as deleteDB } from "@playwright/test";
import { DatabaseActions } from '../../src/utils/Database';
import { CONFIG } from "../../playwright.config";

deleteDB.use({
    headless: true, // Chạy không bật browser
    viewport: { width: 1280, height: 720 },
    launchOptions: {
        slowMo: 0, // Không làm chậm thao tác để tối ưu tốc độ
    },
    storageState: CONFIG.COMMON.STORAGE_PATH
});

deleteDB("Xóa dữ liệu test", async () => {
    const db = new DatabaseActions();
    await db.cleanTestData(CONFIG.ENV.TEST_KEY);
    await db.close();
});