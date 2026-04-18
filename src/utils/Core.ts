import fs from 'fs';
import { CONFIG } from '../../playwright.config';
// --- 2. CÁC HÀM CORE EXPORT (Dùng ở mọi nơi) ---
/**
 * Ví dụ: Hàm tạo ID ngẫu nhiên (Bạn có thể thêm các hàm tương tự vào đây)
 */
export const generateId = (prefix: string = 'ID') => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Ví dụ: Hàm chờ đợi (Sleep) dùng trong automation
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Kiểm tra session trong storagePath có tồn tại và còn hạn hay không
 */
export const isSessionValid = (): boolean => {
    try {
        const data = JSON.parse(fs.readFileSync(CONFIG.COMMON.STORAGE_PATH, 'utf-8'));
        const cookies = data.cookies || [];
        if (cookies.length === 0) return false;
        const now = Date.now() / 1000;
        return !cookies.some((c: { expires: number }) => c.expires !== -1 && c.expires < now);
    } catch {
        return false;
    }
};