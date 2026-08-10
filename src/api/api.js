// ===== Lớp giao tiếp RESTful API =====
// Cố gắng lấy dữ liệu từ RESTful API + CSDL thật (bài 1 / bài 3).
// Nếu backend chưa chạy -> tự động quay về dữ liệu mô phỏng (mock) để demo,
// đồng thời báo rõ nguồn dữ liệu trên giao diện.

import { APP_CONFIG } from '../config.js';
import buildMockSnapshot from '../mock/mockData.js';

const BASE = APP_CONFIG.apiBaseUrl;

// Các endpoint RESTful API (theo chuẩn trả về { error, message, data })
const ENDPOINTS = {
  devices: `${BASE}/api/devices`,
  latest: `${BASE}/api/sensor/latest`,
  logs: `${BASE}/api/logs`,
};

const TIMEOUT_MS = 4000;

function normalizeDevice(raw) {
  return {
    deviceId: raw.deviceId ?? raw.id ?? 0,
    deviceName: raw.deviceName ?? raw.device_name ?? `Thiết bị ${raw.deviceId}`,
    deviceType: raw.deviceType ?? raw.device_type ?? '',
    ipAddress: raw.ipAddress ?? raw.ip_address ?? 'N/A',
    description: raw.description ?? '',
    active: raw.active ?? true,
    lastConnect: raw.lastConnect ?? raw.last_connect ?? raw.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeLed(raw, index) {
  const value = raw?.status ?? raw?.state ?? raw?.isOn ?? raw?.value ?? false;
  return {
    id: raw?.id ?? raw?.ledId ?? raw?.deviceId ?? index + 1,
    name: raw?.name ?? raw?.ledName ?? `Đèn LED ${index + 1}`,
    status: Boolean(value),
  };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json && json.error === true) throw new Error(json.message || 'API trả về lỗi');
    return json?.data ?? json;
  } finally {
    clearTimeout(timer);
  }
}

// Gọi cùng lúc 3 endpoint; endpoint nào lỗi sẽ được thay bằng dữ liệu mock
async function getDashboardSnapshot() {
  const results = await Promise.allSettled([
    fetchJson(ENDPOINTS.devices),
    fetchJson(ENDPOINTS.latest),
    fetchJson(ENDPOINTS.logs),
  ]);

  const mock = buildMockSnapshot();
  const allFailed = results.every((r) => r.status === 'rejected');

  if (allFailed) {
    return { source: 'mock', error: 'Không kết nối được RESTful API, đang hiển thị dữ liệu mô phỏng.', ...mock };
  }

  const devices =
    results[0].status === 'fulfilled' && Array.isArray(results[0].value)
      ? results[0].value.map(normalizeDevice)
      : mock.devices;

  const sensorPayload = results[1].status === 'fulfilled' ? results[1].value : null;
  const sensors = Array.isArray(sensorPayload)
    ? sensorPayload
    : Array.isArray(sensorPayload?.sensors)
      ? sensorPayload.sensors
      : mock.sensors;

  const leds = Array.isArray(sensorPayload?.leds)
    ? sensorPayload.leds.map(normalizeLed)
    : Array.isArray(sensorPayload?.lights)
      ? sensorPayload.lights.map(normalizeLed)
      : mock.leds;

  const logs =
    results[2].status === 'fulfilled' && Array.isArray(results[2].value)
      ? results[2].value
      : mock.logs;

  return { source: 'api', error: null, devices, sensors, leds, logs, fetchedAt: new Date().toISOString() };
}

export { getDashboardSnapshot };