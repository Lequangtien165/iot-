// ===== Dữ liệu giả lập (mock) =====
// Khi chưa kết nối được với RESTful API/CSDL thật ở bài 1, ứng dụng sẽ dùng
// dữ liệu này để mô phỏng 2 thiết bị Wemos D1 (DHT22 + BH1750) đang gửi dữ liệu.
// Dữ liệu thay đổi nhẹ mỗi lần gọi để giống dữ liệu cảm biến thực tế.

const DEVICES = [
  {
    deviceId: 1,
    deviceName: 'Wemos D1 - DHT22',
    deviceType: 'DHT22',
    ipAddress: '192.168.1.101',
    description: 'Đo nhiệt độ & độ ẩm',
  },
  {
    deviceId: 2,
    deviceName: 'Wemos D1 - BH1750',
    deviceType: 'BH1750',
    ipAddress: '192.168.1.102',
    description: 'Đo cường độ ánh sáng',
  },
];

// Giá trị khởi tạo (mô phỏng trạng thái phòng thí nghiệm)
const state = {
  temperature: 28.5,
  humidity: 62,
  light: 380,
  led1: true,
  led2: false,
};

const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function nextValue(current, min, max, step) {
  return clamp(current + rand(-step, step), min, max);
}

// Mô phỏng thiết bị gửi dữ liệu -> cập nhật "lần cuối kết nối"
function touchDevice(id) {
  const d = DEVICES.find((x) => x.deviceId === id);
  d.lastConnect = new Date().toISOString();
  d.active = true;
}

function buildMockSnapshot() {
  const now = Date.now();

  // Wemos D1 - DHT22 gửi nhiệt độ + độ ẩm
  touchDevice(1);
  state.temperature = nextValue(state.temperature, 24, 34, 0.4);
  state.humidity = nextValue(state.humidity, 45, 85, 1.2);

  // Wemos D1 - BH1750 gửi ánh sáng
  touchDevice(2);
  state.light = nextValue(state.light, 100, 800, 25);

  const devices = DEVICES.map((d) => ({
    deviceId: d.deviceId,
    deviceName: d.deviceName,
    deviceType: d.deviceType,
    ipAddress: d.ipAddress,
    description: d.description,
    active: d.active,
    lastConnect: d.lastConnect,
  }));

  const sensors = [
    {
      deviceId: 1,
      deviceName: 'Wemos D1 - DHT22',
      values: [
        { name: 'Nhiệt độ', key: 'temperature', value: state.temperature, unit: '°C' },
        { name: 'Độ ẩm', key: 'humidity', value: state.humidity, unit: '%' },
      ],
    },
    {
      deviceId: 2,
      deviceName: 'Wemos D1 - BH1750',
      values: [
        { name: 'Ánh sáng', key: 'light', value: state.light, unit: 'lux' },
      ],
    },
  ];

  const leds = [
    { id: 1, name: 'Đèn LED 1', status: state.led1 },
    { id: 2, name: 'Đèn LED 2', status: state.led2 },
  ];

  const logs = sensors.flatMap((s) =>
    s.values.map((v) => ({
      id: `${s.deviceId}-${v.key}-${now}`,
      deviceId: s.deviceId,
      deviceName: s.deviceName,
      ipAddress: DEVICES.find((d) => d.deviceId === s.deviceId).ipAddress,
      name: v.name,
      value: v.value,
      unit: v.unit,
      time: new Date(now).toISOString(),
    }))
  );

  return { devices, sensors, logs, leds, fetchedAt: new Date(now).toISOString() };
}

export default buildMockSnapshot;