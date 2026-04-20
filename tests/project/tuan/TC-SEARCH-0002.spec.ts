import { test, expect } from "@playwright/test";
import { AccountsPage } from "../../pages/AccountsPage";
import { DatabaseActions } from '../../../src/utils/Database';
import { CONFIG } from "../../../playwright.config";

// Sử dụng storageState cho Test này
test.use({
    storageState: CONFIG.COMMON.STORAGE_PATH 
});

// Dùng test.describe để gom nhóm các test case của module Accounts
test.describe('TC-SEARCH-0002: Kiểm tra Show Data với Filter nâng cao: Assigned User, Teams,...', () => {
    // Khởi tạo các biến dùng chung
    let accountsPage: AccountsPage;
    let db: DatabaseActions;

    // Chạy trước mỗi test case trong group này
    test.beforeEach(async ({ page }) => {
        accountsPage = new AccountsPage(page);
        db = new DatabaseActions();
        // Kiểm tra điều kiện trước khi test cho filter nâng cao Assigned User, trên 26 bản ghi thì mới test
        const count_acc = await db.getOne(`
            SELECT EXISTS(
                SELECT 1 FROM account 
                WHERE deleted = 0 
                AND assigned_user_id IN (
                    SELECT id 
                    FROM user 
                    WHERE user_name = 'admin' 
                    AND deleted = 0
                )
                LIMIT 1 OFFSET 25
            ) AS hasEnough
        `);
        if (!count_acc?.hasEnough) {
            throw new Error("FAILED: Không đủ 26 Account để test filter nâng cap Assigned User");
        }
        // Truy cập vào trang Account
        await accountsPage.redirect();
    });

    // Chạy sau khi tất cả các test case trong group này hoàn thành
    test.afterAll(async () => {
        await db.close();
    });

    test("Kiểm tra Show Data với các Filter nâng cao Assigned User", async ({
        page,
    }) => {
        // Mở Filter trong thanh Search và Click vào All
        await accountsPage.clickAdvancedFilter("[Is][Assigned User][Admin]");
        // Load dữ liệu bằng Show More đến khi đủ và cộng Data lại
        const UItotal = await accountsPage.countAllRows();
        // Lấy dữ liệu thực tế dưới DB để check với giao diện
        const accounts = await db.query(`SELECT COUNT(id) total 
            FROM account 
            WHERE deleted = 0
            AND assigned_user_id IN (
                SELECT id 
                FROM user 
                WHERE user_name = 'admin' 
                AND deleted = 0
            )`);
        // Kiểm tra dữ liệu trên UI và DB có khớp nhau không
        await expect(UItotal).toBe(accounts[0].total);
    });
});