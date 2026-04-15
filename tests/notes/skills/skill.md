# Playwright Coding Rules for AI Agents

> **Đọc TRƯỚC KHI viết code!**

---

## QUY TẮC (RULES)

| # | Rule | Implementation |
|---|------|----------------|
| 1 | **Locator Priority** | getByRole → getByLabel → getByPlaceholder → getByText → getByTestId → CSS → XPath |
| 2 | **Page Object** | UI tests phải dùng Page Object (extend BasePage) |
| 3 | **Environment** | Dùng `.env` - KHÔNG hardcode |
| 4 | **Smart Wait** | Dùng `waitForSelector`, `waitForLoadState` - KHÔNG dùng `waitForTimeout` |
| 5 | **AAA Pattern** | Arrange → Act → Assert trong test |

---

## PROJECT STRUCTURE

```
project/
├── pages/          # Page Objects (BasePage.ts, LoginPage.ts...)
├── fixtures/       # Test data
├── tests/          # Test specs (.spec.ts)
├── .env           # Environment variables
└── playwright.config.ts
```

---

## CONFIG MODES

| Mode | Config |
|------|--------|
| **Nhanh** | `headless: true`, `video: "off"`, `screenshot: "off"` |
| **Debug** | `headless: false`, `slowMo: 500` |
| **Video khi fail** | `video: "on-first-retry"`, `screenshot: "on-first-failure"` |

---

## USER COMMANDS

| Yêu cầu | Xử lý |
|---------|-------|
| "Chạy nhanh" | Đổi config như bảng trên |
| "Hiện từng bước" / "Debug" | Đổi `headless: false`, thêm `slowMo: 500` |
| "Xem trace" | Dùng `trace: "on-first-retry"` + `npx playwright show-trace` |
| "Chạy 1 browser" | `--project=chromium` |
| "Chạy 1 test" | `npx playwright test tests/file.spec.ts` |

---

## CÁC BƯỚC TRƯỚC KHI CODE

1. **Check project structure** - xem đã có pages/, fixtures/ chưa
2. **Xác định loại test** - UI (dùng POM) hay API (dùng page.request)
3. **Tạo/kiểm tra Page Object** - nếu chưa có thì tạo mới
4. **Viết test theo AAA** - Arrange/Act/Assert
5. **Verify** - dùng checklist bên dưới

---

## CHECKLIST

- [ ] Dùng Page Object (nếu UI test)
- [ ] Dùng đúng locator priority
- [ ] Dùng environment variables (.env)
- [ ] Smart waits thay vì waitForTimeout
- [ ] Clean naming & comments

---

## TÀI LIỆU THAM KHẢO

| Link | Mục đích |
|------|----------|
| https://playwright.dev/docs/intro | Docs chính thức |
| https://playwright.dev/docs/best-practices | Best practices |
| https://playwright.dev/docs/locators | Locators |
| https://playwright.dev/docs/pom | Page Object Model |

---

## QUICK REFERENCE

```typescript
// Click
await page.getByRole('button', { name: 'Submit' }).click();

// Fill
await page.getByLabel('Email').fill('test@test.com');

// Assert
await expect(page.getByText('Success')).toBeVisible();
await expect(page).toHaveURL(/dashboard/);

// Chạy test
npx playwright test                    # All
npx playwright test --debug            # Debug
npx playwright test --project=chromium # Browser
```
