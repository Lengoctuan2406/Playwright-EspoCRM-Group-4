import { Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";

const LOCATORS = {
    showMoreButton: 'a[data-action="showMore"]',
    listRows: ".list-row",

    // Nút chính để mở menu (hiện đang hiển thị chữ "All")
    dropdownButton: 'button.filters-button',
    // Các tùy chọn bên trong dropdown
    optionAll: 'ul.filter-menu a[data-action="selectPreset"][data-name=""]',
    optionStarred: 'ul.filter-menu a[data-name="starred"]',
    optionRecentlyCreated: 'ul.filter-menu a[data-name="recentlyCreated"]'
};

export class AccountsPage extends LoginPage {
    readonly showMoreButton: Locator;
    readonly listRows: Locator;
    constructor(page: Page) {
        super(page);
        // Tạo showMoreButton dùng để load hết dữ liệu ra trước khi đếm số lượng trên giao diện
        this.showMoreButton = page.locator(LOCATORS.showMoreButton);
        this.listRows = page.locator(LOCATORS.listRows);
    }

    /**
     * Ghi đè hàm login để truy cập thẳng vào module Account
     */
    async login(username: string, password: string): Promise<void> {
        // 1. Gọi hàm login của lớp cha (LoginPage) để thực hiện đăng nhập tại trang chủ
        await super.login(username, password);
        // 2. Sau khi đăng nhập xong, mới điều hướng sang trang Account
        await this.page.goto("/#Account", {
            waitUntil: "networkidle"
        });
    }

    async redirect(): Promise<void> {
        // 2. Điều hướng sang trang Account
        await this.page.goto("/#Account", {
            waitUntil: "networkidle"
        });
    }

    /**
     * Hàm hỗ trợ đếm tổng số hàng sau khi nhấn Show More hết mức
     */
    async countAllRows(): Promise<number> {
        while (await this.showMoreButton.isVisible()) {
            const currentCount = await this.listRows.count();
            await this.showMoreButton.click();

            // Đợi dữ liệu mới load xong (số hàng tăng lên)
            await this.page.waitForFunction(
                (oldValue) => document.querySelectorAll(".list-row").length > oldValue,
                currentCount,
            );
        }
        return await this.listRows.count();
    }

    async clickFilter(opts: string) {
        // 1. Click mở Dropdown Filter (Nút này nằm cạnh ô Search)
        await this.page.click(LOCATORS.dropdownButton);
        // 2. Chờ menu hiển thị (đảm bảo menu đã bung ra)
        await this.page.waitForSelector('ul.filter-menu', { state: 'visible' });
        // 3. Click vào tùy chọn "All" bên trong menu
        switch (opts) {
            case "Starred":
                await this.page.click(LOCATORS.optionStarred);
                break;
            case "RecentlyCreated":
                await this.page.click(LOCATORS.optionRecentlyCreated);
                break;
            default:
                await this.page.click(LOCATORS.optionAll);
                break;
        }
        // 4. Đợi hệ thống tải lại dữ liệu sau khi lọc
        await this.page.waitForLoadState('networkidle');
    }

    async clickFilterAll() {
        // 1. Click mở Dropdown Filter (Nút này nằm cạnh ô Search)
        await this.page.click(LOCATORS.dropdownButton);
        // 2. Chờ menu hiển thị (đảm bảo menu đã bung ra)
        await this.page.waitForSelector('ul.filter-menu', { state: 'visible' });
        // 3. Click vào tùy chọn "All" bên trong menu
        await this.page.click(LOCATORS.optionAll);
        // 4. Đợi hệ thống tải lại dữ liệu sau khi lọc
        await this.page.waitForLoadState('networkidle');
    }

    async clickFilterStarred() {
        // 1. Click mở Dropdown Filter (Nút này nằm cạnh ô Search)
        await this.page.click(LOCATORS.dropdownButton);
        // 2. Chờ menu hiển thị (đảm bảo menu đã bung ra)
        await this.page.waitForSelector('ul.filter-menu', { state: 'visible' });
        // 3. Click vào tùy chọn "All" bên trong menu
        await this.page.click(LOCATORS.optionStarred);
        // 4. Đợi hệ thống tải lại dữ liệu sau khi lọc
        await this.page.waitForLoadState('networkidle');
    }

    async clickFilterRecentlyCreated() {
        // 1. Click mở Dropdown Filter (Nút này nằm cạnh ô Search)
        await this.page.click(LOCATORS.dropdownButton);
        // 2. Chờ menu hiển thị (đảm bảo menu đã bung ra)
        await this.page.waitForSelector('ul.filter-menu', { state: 'visible' });
        // 3. Click vào tùy chọn "All" bên trong menu
        await this.page.click(LOCATORS.optionRecentlyCreated);
        // 4. Đợi hệ thống tải lại dữ liệu sau khi lọc
        await this.page.waitForLoadState('networkidle');
    }
}
