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
