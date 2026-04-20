import mysql, { Pool, PoolConnection } from 'mysql2/promise';

export class DatabaseActions {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST!,
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 10000
        });
    }

    /**
     * Xóa dữ liệu mẫu trên nhiều bảng cùng lúc
     * @param keyword Từ khóa dùng để nhận diện dữ liệu test
     */
    async cleanTestData(keyword: string): Promise<void> {
        const tables = [
            { name: 'account', column: 'description' },
            { name: 'lead', column: 'description' },
            { name: 'contact', column: 'description' }
        ];
        for (const table of tables) {
            const sql = `DELETE FROM \`${table.name}\` WHERE \`${table.column}\` LIKE ?`;
            await this.query(sql, [`%${keyword}%`]);
            console.log(`>>> Đã dọn dẹp bảng: ${table.name}`);
        }
    }

    /**
     * 1. Thực thi truy vấn tổng quát
     */
    async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows as T[];
        } catch (error: any) {
            this.logError(sql, params, error);
            throw error;
        }
    }

    /**
     * Đếm số lượng bản ghi chưa bị xóa (deleted = 0)
     * @param tableName Tên bảng cần đếm
     */
    async countActive(tableName: string): Promise<number> {
        const sql = `SELECT COUNT(*) as total FROM \`${tableName}\` WHERE deleted = 0`;
        const result = await this.getOne<{ total: number }>(sql);
        return result ? result.total : 0;
    }

    /**
     * 2. Lấy duy nhất 1 bản ghi (Rất tiện khi check tồn tại)
     */
    async getOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
        const results = await this.query<T>(sql, params);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * 3. Chạy Transaction (An toàn tuyệt đối cho dữ liệu)
     * Dùng khi bạn cần thực hiện nhiều câu lệnh Insert/Update liên tiếp
     */
    async transaction(callback: (connection: PoolConnection) => Promise<void>): Promise<void> {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        try {
            await callback(connection);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('--- TRANSACTION ROLLBACKED ---');
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * 4. Kiểm tra xem bản ghi có tồn tại không (Trả về boolean)
     */
    async exists(tableName: string, conditions: string, params: any[] = []): Promise<boolean> {
        const sql = `SELECT 1 FROM \`${tableName}\` WHERE ${conditions} LIMIT 1`;
        const result = await this.getOne(sql, params);
        return result !== null;
    }

    /**
     * isAnyExists
     */
    async isAnyExists(tableName: string, column: string, values: any | any[]): Promise<boolean> {
        // 1. Tự động chuyển đổi thành mảng nếu đầu vào là giá trị đơn lẻ
        const normalizedValues = Array.isArray(values) ? values : [values];
        // 2. Kiểm tra mảng rỗng
        if (normalizedValues.length === 0) return false;
        const sql = `SELECT 1 
        FROM \`${tableName}\` 
        WHERE deleted = 0
        AND \`${column}\` IN (?) 
        LIMIT 1`;
        try {
            // Truyền normalizedValues vào trong một mảng bọc ngoài [normalizedValues]
            const [rows] = await this.pool.query(sql, [normalizedValues]);
            const results = rows as any[];
            return results.length > 0;
        } catch (error: any) {
            this.logError(sql, normalizedValues, error);
            throw error;
        }
    }

    /**
     * Log lỗi chuyên nghiệp
     */
    private logError(sql: string, params: any[], error: any) {
        console.error('\x1b[31m%s\x1b[0m', '>>> DATABASE ERROR <<<'); // In màu đỏ
        console.error('SQL:', sql);
        console.error('Params:', JSON.stringify(params));
        console.error('Error Message:', error.message);
    }

    async close() {
        await this.pool.end();
    }
}