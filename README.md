# Playwright SuiteCRM - Group 4

Dự án Automation Testing sử dụng Playwright cho phần mềm SuiteCRM.

## Giới thiệu

Dự án này được xây dựng nhằm mục đích kiểm thử tự động (Automation Testing) cho hệ thống SuiteCRM sử dụng Playwright - một framework testing hiện đại và mạnh mẽ. Dự án được phát triển bởi nhóm 4 trong khuôn khổ Final Capstone.

### Công nghệ sử dụng

- **Playwright**: Framework automation testing
- **TypeScript**: Ngôn ngữ lập trình chính
- **Node.js**: Môi trường runtime
- **VS Code**: Editor khuyến nghị

## Cách clone dự án

### Bước 1: Cài đặt các công cụ cần thiết

#### Tải về Node.js và npm
- Truy cập: https://nodejs.org/en/download
- Tải bản **Windows Installer (.msi)**

#### Tải VS Code
- Truy cập: https://code.visualstudio.com/download

### Bước 2: Clone dự án về máy

```bash
git clone https://github.com/Lengoctuan2406/Playwright-SuiteCRM-Group-4.git
cd Playwright-SuiteCRM-Group-4
```

### Bước 3: Cài đặt các Extension cho VS Code

Khuyến nghị cài đặt một Profile mới trong VS Code để tối ưu cho việc testing (Vào Setting -> Profile -> New Profile).

Các Extension cần cài đặt:

| Extension | Mô tả |
|-----------|-------|
| Playwright Test for VSCode | Hỗ trợ UI thao tác tốt nhất cho Testing |
| ESLint | Kiểm tra lỗi cú pháp TypeScript, JavaScript |
| Prettier - Code formatter | Format code tự động |
| Console Ninja | Hiển thị Console.log trong code |
| Todo Tree | Quản lý công việc cần làm |
| Path Intellisense | Gợi ý đường dẫn file |
| Peacock | Đổi màu cửa sổ để phân biệt |

### Bước 4: Cấu hình VS Code (Tùy chọn)

Nhấn `Ctrl + Shift + P`, gõ "Open User Setting" và thêm các cấu hình sau vào cuối file:

```json
{
  "editor.mouseWheelZoom": true,
  "editor.formatOnPaste": true,
  "terminal.integrated.scrollback": 10000
}
```

### Bước 5: Cài đặt dependencies

Sau khi clone dự án về, chạy các lệnh sau theo thứ tự:

```bash
# Cập nhật tất cả thư viện cần thiết
npm install @playwright/test@latest

# Cài đặt các trình duyệt cần thiết cùng thư viện đi kèm
npx playwright install --with-deps
```

### Bước 6: Mở quyền chạy Terminal (Nếu gặp lỗi)

Nếu gặp lỗi khi chạy lệnh, thực hiện các bước sau:

1. Mở PowerShell với quyền Administrator
2. Chạy lệnh:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Chọn "Yes" để xác nhận

## Cách chạy tests

### Chạy tất cả các tests
```bash
npx playwright test
```

### Chạy tests với UI
```bash
npx playwright test --ui
```

### Chạy tests cụ thể
```bash
npx playwright test example.spec.ts
```

### Xem báo cáo HTML
```bash
npx playwright show-report
```

## Cấu hình

File cấu hình chính: `playwright.config.ts`

Các cấu hình quan trọng:
- **testDir**: Thư mục chứa tests (`./tests`)
- **headless**: Chạy browser ẩn hoặc hiện (mặc định: `false`)
- **retries**: Số lần thử lại khi test failed
- **reporter**: Định dạng báo cáo (mặc định: `html`)

## Cấu trúc dự án

```
Playwright-SuiteCRM-Group-4/
├── tests/                  # Thư mục chứa các test cases
│   └── example.spec.ts    # File test mẫu
├── guides/                # Thư mục hướng dẫn
│   └── setup.log         # File hướng dẫn cài đặt
├── playwright.config.ts   # File cấu hình Playwright
├── package.json          # File quản lý dependencies
└── README.md             # File giới thiệu dự án
```

## Đóng góp

Mọi đóng góp và ý kiến đóng góp vui lòng tạo Issue hoặc Pull Request trên GitHub.