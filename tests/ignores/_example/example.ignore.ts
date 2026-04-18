import { test } from '@playwright/test';
import { log, sleep, generateId } from '../../src/utils/Core';

test('Chứa các mẫu code', async () => {
  // Tạo ID ngẫu nhiên
  const traceId = generateId('API');
  log(`[${traceId}] Bắt đầu thực thi bước 1`);
  // Chờ 2 giây
  await sleep(2000);
  // Ghi log
  log(`[${traceId}] Hoàn thành sau 2 giây`);
});
