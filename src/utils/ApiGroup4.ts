import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class ApiActions {
    private request: APIRequestContext;
    private token: string;

    constructor(request: APIRequestContext, token: string = '') {
        this.request = request;
        this.token = token;
    }

    /**
     * Hàm hỗ trợ tạo Header mặc định kèm Token
     */
    private getHeaders(customHeaders?: { [key: string]: string }) {
        const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return { ...headers, ...customHeaders };
    }

    /**
 * Gửi yêu cầu GET với xử lý Query Params an toàn
 */
    async get(url: string, params?: object, headers?: { [key: string]: string }): Promise<APIResponse> {
        // Lọc bỏ các params bị undefined hoặc null để tránh lỗi Playwright
        const cleanParams = params
            ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
            : undefined;

        return await this.request.get(url, {
            params: cleanParams,
            headers: this.getHeaders(headers)
        });
    }

    /**
     * Gửi yêu cầu POST
     */
    async post(url: string, data: any, headers?: { [key: string]: string }): Promise<APIResponse> {
        return await this.request.post(url, {
            data: data,
            headers: this.getHeaders(headers)
        });
    }

    /**
     * Gửi yêu cầu PUT (Cập nhật toàn bộ)
     */
    async put(url: string, data: any, headers?: { [key: string]: string }): Promise<APIResponse> {
        return await this.request.put(url, {
            data: data,
            headers: this.getHeaders(headers)
        });
    }

    /**
     * Gửi yêu cầu DELETE
     */
    async delete(url: string, headers?: { [key: string]: string }): Promise<APIResponse> {
        return await this.request.delete(url, {
            headers: this.getHeaders(headers)
        });
    }
}