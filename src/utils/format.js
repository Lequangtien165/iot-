// ===== Hàm tiện ích định dạng thời gian & trạng thái thiết bị =====
import { APP_CONFIG } from '../config.js';

const OFFLINE_AFTER = APP_CONFIG.offlineAfterSeconds * 1000;

export function formatTime(iso) {
  if (!iso) return 'Chưa có dữ liệu';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Chưa có dữ liệu';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatClock(now) {
  return now.toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// "Vừa xong", "cách đây 2 phút", ... dựa trên thời điểm hiện tại
export function timeAgo(iso, now = Date.now()) {
  if (!iso) return 'Chưa có dữ liệu';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'Chưa có dữ liệu';
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  if (s < 10) return 'Vừa xong';
  if (s < 60) return `cách đây ${s} giây`;
  const m = Math.floor(s / 60);
  if (m < 60) return `cách đây ${m} phút`;
  const h = Math.floor(m / 60);
  if (h < 24) return `cách đây ${h} giờ`;
  const d = Math.floor(h / 24);
  return `cách đây ${d} ngày`;
}

// Thiết bị còn hoạt động hay không (theo lastConnect + ngưỡng offline)
export function isActive(device, now = Date.now()) {
  if (device.active === false) return false;
  if (!device.lastConnect) return true;
  const t = new Date(device.lastConnect).getTime();
  if (Number.isNaN(t)) return true;
  return now - t <= OFFLINE_AFTER;
}

export function formatValue(value, decimals = 1) {
  if (value === undefined || value === null) return '--';
  const n = Number(value);
  if (Number.isNaN(n)) return '--';
  return n.toFixed(decimals);
}