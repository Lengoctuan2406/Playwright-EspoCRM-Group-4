import { test, expect } from "@playwright/test";
import { DatabaseActions } from '../../src/utils/DatabaseGroup4';

test.use({
    headless: true, // Chạy không bật browser
    viewport: { width: 1280, height: 720 },
    launchOptions: {
        slowMo: 0, // Không làm chậm thao tác để tối ưu tốc độ
    }
});

test("Xóa dữ liệu test", async ({
    page,
}) => {
    // Bật trong mô trường Product, đảm bảo không có dữ liệu Test
    test.skip();
    const db = new DatabaseActions();
    await db.cleanAllTestData(`UAT_TESTING`);
    await db.close();
});