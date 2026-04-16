import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
/**
 * Đọc đầy đủ tại https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* 
    testDir
      Đường dẫn quét chạy các tests
      Lưu ý: 
        - Chỉ định playwright phải chạy trong folder này
  */
  testDir: "./tests",
  /* 
    fullyParallel
      Chạy các test song song với nhau
      Lưu ý: 
        - Stress test nhẹ
        - Xử lý đọc ghi đồng thời vào DB, có thể gây xung đột
  */
  fullyParallel: true,
  /* 
    forbidOnly
      Đảm bảo không có test.only nào trong code khi CI/CD, 
      hàm làm sẽ làm tất cả các test khác không chạy
  */
  forbidOnly: !!process.env.CI,
  /* 
    retries
      Thử lại các test failed để tránh lỗi Flaky tests(Lúc được lúc không)
      Lưu ý: 
        - Local thì đặt bằng 0 để không chạy lại khi failed
        - code ban đầu: retries: process.env.CI ? 2 : 0,
  */
  retries: 3,
  /* 
    workers
      Số lượng tiến trình chạy song song với nhau
      Lưu ý: 
        - Trên CI/CD thì nên để bằng 1, tránh crash web hoặc timeout
        - undefined sẽ mặc định playwright tự động cấp phát theo fullyParallel
  */
  workers: process.env.CI ? 1 : undefined,
  /* 
    workers
      Xuất các Reports khác nhau, tìm hiểu thêm tại https://playwright.dev/docs/test-reporters
      Lưu ý: 
        - html: Xuất báo cáo dạng html để xem trực quan hơn
        - list: Hiển thị list trong terminal
        - json: reporter: ['json', { outputFile: 'results.json' }] xuất json cho hệ thống khác
        - junit: reporter: ['junit', { outputFile: 'results.xml' }] dành cho các hệ thống CI
  */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PAGE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Mở Browser lên để xem thao tác, true thì không hiện UI, tăng tốc độ chạy */
    headless: false,
    /* Khai báo màn hình hiển thị, test UI */
    viewport: { width: 1280, height: 720 },
    /* Bypass chứng chỉ bảo mật (SSL/TLS) của các browser */
    ignoreHTTPSErrors: true,
    /* Chỉ quay video đối với các test bị failed, tiết kiệm dung lượng */
    video: "on-first-retry",
    /* Chụp hình sau lần thất bại đầu tiên */
    screenshot: "on-first-failure",
    /* Cho phép playwright tải xuống các tệp dữ liệu khi test */
    acceptDownloads: false,
    /* Cấu hình tối đa cho việc chờ đợi các elements hiện lên để click */
    actionTimeout: 0,
    /* Cấu hình tối đa cho việc chờ đợi trang tải xong dữ liệu */
    navigationTimeout: 0,
    /* Bypass Content Security Policy, nên bật khi can thiệp sâu logic, không thì tắt để test web vẫn có CSP*/
    bypassCSP: true,
    /* Xác thực chứng chỉ phía Client, dành cho hệ thống ngân hàng bảo mật cao */
    // clientCertificates: [
    //   {
    //     origin: "https://example.com",
    //     certPath: "./cert.pem",
    //     keyPath: "./key.pem",
    //     passphrase: "mysecretpassword",
    //   },
    // ],
    /* Hỗ trợ cho những website có darkmode */
    // colorScheme: "dark",
    /* Tắt các animation trên web để bot hoạt động chuẩn xác hơn */
    contextOptions: {
      reducedMotion: "reduce",
    },
    /* Dùng 2 cho các bài test UI sâu, giao diện iphone, 1 để dùng cho các giao diện căn bản */
    deviceScaleFactor: 1,
    /* Các kỉ thuật nâng cao để bypass bot detection */
    // extraHTTPHeaders: {
    //   "X-My-Header": "value",
    // },
    /* Giả lập vị trí thật của browser hiện tại */
    // geolocation: { longitude: 12.492507, latitude: 41.889938 },
    /* Quyết định múi giờ mà trình duyệt cần */
    // timezoneId: "Europe/Rome",
    /* Chuyển đổi browser sang chế độ máy tính bảng chạm vuốt */
    // hasTouch: true,
    /* Giúp truy cập Basic Auth khi không có UI cho playwright thao tác lên */
    // httpCredentials: {
    //   username: "user",
    //   password: "pass",
    // },
    /* Khởi chạy browser trên mobile để test */
    isMobile: false,
    /* Quyết định có chạy mã JS trên trình duyệt hay không */
    javaScriptEnabled: true,
    /* Điều khiển sâu vào browser để thay đổi theo ý muốn */
    launchOptions: {
      // 1. Làm chậm 500ms mỗi thao tác để dễ quan sát khi debug
      slowMo: 500,
      // 2. Các tham số dòng lệnh tối ưu cho Chromium
      args: [
        "--start-maximized", // Mở cửa sổ to hết cỡ ngay từ đầu
        "--disable-notifications", // Tắt các thông báo đẩy (Push notifications)
        "--disable-infobars", // Tắt thanh "Chrome is being controlled by..."
        "--no-sandbox", // Cần thiết nếu chạy trên Docker/Linux
      ],
      // 3. Chạy trên Chrome "chính chủ" thay vì bản máy sạch của Playwright
      channel: "chrome",
    },
    /* Cho việc kiểm thử đa ngôn ngữ */
    // locale: "it-IT",
    /* Kiểm thử khi mất kết nối mạng */
    offline: false,
    /* Cấp một lúc nhiều quyền để Bot "rảnh tay" làm việc mà không bị timeout */
    permissions: [
      "notifications", // Thông báo đẩy
      // "geolocation", // Vị trí địa lý (thường đi kèm config geolocation)
      "camera", // Quyền dùng Webcam (cho các app họp trực tuyến)
      "microphone", // Quyền dùng Mic
      "clipboard-read", // Quyền đọc bộ nhớ tạm (copy-paste)
      "clipboard-write", // Quyền ghi vào bộ nhớ tạm
    ],
    /* Dùng đối với các công ty yêu cầu cao về tương lửa */
    // proxy: {
    //   server: "http://myproxy.com:3128",
    //   bypass: "localhost",
    // },
    /* Khởi chạy các service của browser như cache, giúp chạy 
    nhanh hơn, mặc định là block để mỗi test luôn mới nhất */
    serviceWorkers: "block",
    /* 
      Dùng cho lưu trạng thái đăng nhập, cookie trình duyệt để
      không đăng nhập nhiều lần trên nhiều test 
    */
    // storageState: "storage-state.json",
    /* Một số custom userAgent để nhận diện traffic test hay người dùng thật */
    // userAgent: "some custom ua",

    // TODO Tiếp tục với https://playwright.dev/docs/test-configuration
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    /* Test against branded browsers. */
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  /* Đảm bảo server hoạt động trước khi test */
  // webServer: {
  //   command: "npm run start",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
});
