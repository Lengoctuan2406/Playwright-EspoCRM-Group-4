import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Login test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
        process.env.PAGE_ADMIN_USERNAME!,
        process.env.PAGE_ADMIN_PASSWORD!,
    );
    await expect(page).toHaveTitle(/EspoCRM/);
});


/**
 * Hàm thực hiện nhấn Show More cho đến khi hết dữ liệu và đếm tổng số hàng
 */
// async function countAllAccountRows(page) {
//     const showMoreLocator = page.locator('a[data-action="showMore"]');

//     // 1. Lặp cho đến khi nút Show More không còn hiển thị (hoặc bị ẩn bởi class 'hidden')
//     while (await showMoreLocator.isVisible()) {
//         // Lấy số lượng hàng hiện tại trước khi nhấn
//         const currentCount = await page.locator('.list-row').count();
        
//         // Nhấn nút Show More
//         await showMoreLocator.click();

//         // Chờ cho đến khi số lượng hàng tăng lên (xác nhận dữ liệu mới đã load xong)
//         // Hoặc chờ cho các yêu cầu mạng (network) ổn định lại
//         await page.waitForFunction((prevCount) => {
//             return document.querySelectorAll('.list-row').length > prevCount || 
//                    document.querySelector('.show-more').classList.contains('hidden');
//         }, currentCount);

//         // Thêm một khoảng nghỉ ngắn nếu cần thiết để UI ổn định
//         await page.waitForTimeout(500); 
//     }

//     // 2. Sau khi đã load hết, tiến hành đếm tổng số hàng
//     const totalRows = await page.locator('.list-row').count();
//     console.log(`Tổng số hàng sau khi load hết: ${totalRows}`);
    
//     return totalRows;
// }

// // Cách sử dụng trong script test:
// const finalCount = await countAllAccountRows(page);