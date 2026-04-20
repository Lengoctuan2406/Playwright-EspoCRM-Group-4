import { Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";

export class AccountsPage extends LoginPage {
    readonly showMoreButton: Locator;
    readonly listRows: Locator;
    constructor(page: Page) {
        super(page);
        // Tạo showMoreButton dùng để load hết dữ liệu ra trước khi đếm số lượng trên giao diện
        this.showMoreButton = page.locator("a[data-action=\"showMore\"]");
        this.listRows = page.locator(".list-row");
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

    async clickAdvancedFilter(opts: string) {
        await this.page.locator("button.add-filter-button").click();
        switch (opts) {
            case "[Is][Assigned User][Admin]":
                // Chọn Assigned User
                await this.page.click('li.filter-item a[data-name="assignedUser"]');
                const field = this.page.locator('div[data-name="assignedUser"]');
                // Click mở dropdown
                await field.locator('.selectize-input').click();
                // Chỉ tìm option "is" nằm TRONG field này
                await field.locator('.selectize-dropdown-content .option[data-value="is"]').click();
                // Nhập giá trị
                await field.locator('input[data-name="assignedUserName"]').fill('Admin'); 
                // Nhấn Enter để hiện nut Apply Filter
                await this.page.keyboard.press('Enter');
                // Apply bộ filter để tìm kiếm
                await this.page.click('a[data-action="applyFilters"]');
                break;
            case "Teams":
                await this.page.locator("li.filter-item a[data-name=\"teams\"]").click();
                break;
            default:
                break;
        }
        await this.page.waitForLoadState('networkidle');
    }

    async clickFilter(opts: string) {
        // 1. Click mở Dropdown Filter (Nút này nằm cạnh ô Search)
        await this.page.locator("button.filters-button").click();
        // 2. Chờ menu hiển thị (đảm bảo menu đã bung ra)
        await this.page.waitForSelector('ul.filter-menu', { state: 'visible' });
        // 3. Click vào tùy chọn "All" bên trong menu
        switch (opts) {
            case "Starred":
                await this.page.click("ul.filter-menu a[data-name=\"starred\"]");
                break;
            case "RecentlyCreated":
                await this.page.click("ul.filter-menu a[data-name=\"recentlyCreated\"]");
                break;
            default:
                await this.page.click("ul.filter-menu a[data-action=\"selectPreset\"][data-name=\"\"]");
                break;
        }
        // 4. Đợi hệ thống tải lại dữ liệu sau khi lọc
        await this.page.waitForLoadState('networkidle');
    }

    async seachingInput(input: string) {
        // Tìm theo data-name và thực hiện fill
        await this.page.fill('input[data-name="textFilter"]', input);
        // Enter để Apply Seach
        await this.page.keyboard.press('Enter');
    }

    /**
     * Chọn các bản ghi đầu tiên và trả về danh sách ID
     * @param count Số lượng bản ghi muốn chọn
     * @returns Mảng các string ID của các bản ghi đã chọn
     */
    async removeSelectTops(count: number): Promise<string[]> {
        const selectedIds: string[] = [];
        // 1. Xác định phạm vi bảng Account
        const accountList = this.page.locator('div[data-scope="Account"]');
        const checkboxes = accountList.locator('tbody input.record-checkbox');
        // Đợi cho đến khi ít nhất một checkbox xuất hiện (bảng đã load xong)
        await checkboxes.first().waitFor({ state: 'visible' });
        // 2. Tính toán số lượng thực tế có thể chọn
        const availableCount = await checkboxes.count();
        const limit = Math.min(count, availableCount);
        // 3. Vòng lặp thực hiện check và lấy ID
        for (let i = 0; i < limit; i++) {
            const cb = checkboxes.nth(i);
            // Thực hiện check
            await cb.check();
            // Lấy data-id từ thuộc tính của element
            const id = await cb.getAttribute('data-id');
            if (id) {
                selectedIds.push(id);
            }
        }
        // Định vị container chính
        const toolbar = this.page.locator('.list-buttons-container');

        // 1. Click Actions (Ràng buộc visible để không nhấn nhầm nút ẩn)
        await toolbar.locator('.actions .actions-button:visible').click();

        // 2. Định vị nút Remove trong menu (Dùng :visible để tránh lỗi 2 elements)
        // Lưu ý: .actions-menu thường nằm ngoài toolbar trong DOM, 
        // nên dùng this.page.locator sẽ an toàn hơn toolbar.locator
        const removeOption = toolbar.locator('.actions-menu:visible a[data-action="remove"]').first();

        await removeOption.waitFor({ state: 'visible' });
        await removeOption.click();

        // 3. Chờ Modal xác nhận xuất hiện
        const confirmModal = this.page.locator('.dialog-confirm.modal.in');
        await confirmModal.waitFor({ state: 'visible' });

        // 4. Click nút "Remove" xác nhận
        // Thêm .first() nếu cần, nhưng data-name="confirm" thường là duy nhất trong modal
        await confirmModal.locator('button[data-name="confirm"]').click();

        // 5. Chờ Modal đóng hoàn toàn trước khi làm việc khác
        await confirmModal.waitFor({ state: 'hidden' });

        return selectedIds;
    }
}
