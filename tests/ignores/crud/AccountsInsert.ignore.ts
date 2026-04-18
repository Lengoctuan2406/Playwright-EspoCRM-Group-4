import { test as insertDB } from "@playwright/test";
import { DataFaker } from '../../../src/utils/DataFaker';
import { CONFIG } from "../../../playwright.config";
import { AccountsPage } from "../../pages/AccountsPage";

insertDB.use({
    headless: true, // Chạy không bật browser
    viewport: { width: 1280, height: 720 },
    launchOptions: {
        slowMo: 0, // Không làm chậm thao tác để tối ưu tốc độ
    },
    storageState: CONFIG.COMMON.STORAGE_PATH
});

insertDB("Tạo thêm dữ liệu Account test", async ({
    page,
}) => {
    // Số lượng records muốn tạo
    const number_create=10;
    // login vào
    const accountsPage = new AccountsPage(page);
    await accountsPage.redirect();
    let i = 0;
    while (i < number_create) {
        // Chuyển đến trang create của Accounts
        await page.goto("/#Account/create", {
            waitUntil: "domcontentloaded"
        });
        // Nhập dữ liệu
        await page.fill('input[data-name="name"]', DataFaker.getFullName());
        await page.fill('input[data-name="website"]', DataFaker.getWebsite());
        await page.fill('.field[data-name="emailAddress"] input.email-address', DataFaker.getEmail());
        await page.fill('textarea[data-name="billingAddressStreet"]', DataFaker.getStreet());
        // Bắt buộc phải có UAT_TESTING để xóa dữ liệu sau này
        await page.fill('textarea[data-name="description"]', CONFIG.ENV.TEST_KEY);
        // Click Save và đợi chuyển trang/phản hồi
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }), // Đợi lưu xong và chuyển trang
            page.click('button[data-action="save"]')
        ]);
        i++;
    }
});

insertDB("Tạo thêm dữ liệu Account test với Starred", async ({
    page,
}) => {
    // Số lượng records muốn tạo
    const number_create = 10;
    // login vào
    const accountsPage = new AccountsPage(page);
    await accountsPage.redirect();
    let i = 0;
    while (i < number_create) {
        // Chuyển đến trang create của Accounts
        await page.goto("/#Account/create", {
            waitUntil: "domcontentloaded"
        });
        // Nhập dữ liệu
        await page.fill('input[data-name="name"]', DataFaker.getFullName());
        await page.fill('input[data-name="website"]', DataFaker.getWebsite());
        await page.fill('.field[data-name="emailAddress"] input.email-address', DataFaker.getEmail());
        await page.fill('textarea[data-name="billingAddressStreet"]', DataFaker.getStreet());
        // Bắt buộc phải có UAT_TESTING để xóa dữ liệu sau này
        await page.fill('textarea[data-name="description"]', 'UAT_TESTING');
        // Click Save và đợi chuyển trang/phản hồi
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }), // Đợi lưu xong và chuyển trang
            page.click('button[data-action="save"]')
        ]);
        await page.click('a[data-name="star"]');
        i++;
    }
});

insertDB("Tạo thêm dữ liệu Account test với Assigned User là Admin", async ({
    page,
}) => {
    // Số lượng records muốn tạo
    const number_create = 3;
    // login vào
    const accountsPage = new AccountsPage(page);
    await accountsPage.redirect(); 
    await page.goto("/#Account/create", {
        waitUntil: "domcontentloaded"
    });
    let i = 0;
    while (i < number_create) {
        // Chuyển đến trang create của Accounts
        await page.goto("/#Account/create", {
            waitUntil: "domcontentloaded"
        });
        // Nhập dữ liệu
        await page.fill("input[data-name=\"name\"]", DataFaker.getFullName());
        await page.fill("input[data-name=\"website\"]", DataFaker.getWebsite());
        await page.fill(".field[data-name=\"emailAddress\"] input.email-address", DataFaker.getEmail());
        await page.fill("textarea[data-name=\"billingAddressStreet\"]", DataFaker.getStreet());
        // Bắt buộc phải có UAT_TESTING để xóa dữ liệu sau này
        await page.fill("textarea[data-name=\"description\"]", "UAT_TESTING");

        // Assigned User
        await page.click(".field[data-name=\"assignedUser\"] button[data-action=\"selectLink\"]"); 
        await page.getByText("Admin").nth(2).click();

        // Click Save và đợi chuyển trang/phản hồi
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle" }), // Đợi lưu xong và chuyển trang
            page.click("button[data-action=\"save\"]")
        ]);
        i++;
    }
});