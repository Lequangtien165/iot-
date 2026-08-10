import React from 'react';
import { APP_CONFIG } from '../config.js';
import StatCard from './StatCard.jsx';
import DeviceCard from './DeviceCard.jsx';
import SensorOverview from './SensorOverview.jsx';
import { isActive, timeAgo } from '../utils/format.js';

const DEFAULT_LEDS = [
  { id: 1, name: 'Đèn LED 1', status: false },
  { id: 2, name: 'Đèn LED 2', status: false },
];

const DEFAULT_SENSOR_VALUES = {
  temperature: 25,
  humidity: 60,
  light: 15,
};

const MQTT_TOPICS = {
  led1: 'mmcl/nhom2/led/n1',
  led2: 'mmcl/nhom2/led/n2',
  temperature: 'mmcl/nhom2/sensor/temperature',
  humidity: 'mmcl/nhom2/sensor/humidity',
  light: 'mmcl/nhom2/sensor/light',
};

export default function Dashboard({ data }) {
  const now = Date.now();
  const devices = data?.devices ?? [];
  const sensors = data?.sensors ?? [];
  const [leds, setLeds] = React.useState(data?.leds?.length ? data.leds : DEFAULT_LEDS);
  const [brokerHost, setBrokerHost] = React.useState('172.20.66.42');
  const [brokerPort, setBrokerPort] = React.useState('9001');
  const [brokerConnected, setBrokerConnected] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [sensorValues, setSensorValues] = React.useState(DEFAULT_SENSOR_VALUES);
  const clientRef = React.useRef(null);

  React.useEffect(() => {
    if (Array.isArray(data?.leds) && data.leds.length > 0) {
      setLeds(data.leds);
    } else if (!Array.isArray(data?.leds)) {
      setLeds(DEFAULT_LEDS);
    }
  }, [data?.leds]);

  React.useEffect(() => {
    const next = {};
    sensors.forEach((sensor) => {
      sensor.values?.forEach((value) => {
        if (value.key === 'temperature') next.temperature = value.value;
        if (value.key === 'humidity') next.humidity = value.value;
        if (value.key === 'light') next.light = value.value;
      });
    });

    if (Object.keys(next).length > 0) {
      setSensorValues((prev) => ({ ...prev, ...next }));
    }
  }, [sensors]);

  React.useEffect(() => () => {
    if (clientRef.current) {
      clientRef.current.end(true);
    }
  }, []);

  const total = devices.length;
  const online = devices.filter((d) => isActive(d, now)).length;
  const offline = total - online;

  const updateLedState = (id, nextStatus) => {
    setLeds((current) =>
      current.map((led) => (led.id === id ? { ...led, status: nextStatus } : led))
    );
  };

  const toggleLed = (id) => {
    if (!brokerConnected || !clientRef.current) {
      window.alert('Vui lòng kết nối MQTT trước khi điều khiển đèn');
      return;
    }

    const led = leds.find((item) => item.id === id);
    const nextStatus = !(led?.status ?? false);
    const topic = id === 1 ? MQTT_TOPICS.led1 : MQTT_TOPICS.led2;

    clientRef.current.publish(topic, nextStatus ? 'ON' : 'OFF');
    updateLedState(id, nextStatus);
  };

  const connectBroker = () => {
    const normalizedHost = brokerHost.trim() || '192.168.1.xxx';
    const normalizedPort = Number(brokerPort) || 9001;
    const url = `ws://${normalizedHost}:${normalizedPort}/mqtt`;

    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    if (!window.mqtt) {
      window.alert('Thư viện MQTT chưa sẵn sàng. Vui lòng tải lại trang.');
      setConnecting(false);
      return;
    }

    setConnecting(true);
    const client = window.mqtt.connect(url, {
      clientId: `web_dashboard_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 5000,
    });

    clientRef.current = client;

    client.on('connect', () => {
      setBrokerConnected(true);
      setConnecting(false);
      client.subscribe(MQTT_TOPICS.temperature);
      client.subscribe(MQTT_TOPICS.humidity);
      client.subscribe(MQTT_TOPICS.light);
      client.subscribe(MQTT_TOPICS.led1);
      client.subscribe(MQTT_TOPICS.led2);
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();

      if (topic === MQTT_TOPICS.temperature) {
        setSensorValues((prev) => ({ ...prev, temperature: Number(payload) || prev.temperature }));
      }
      if (topic === MQTT_TOPICS.humidity) {
        setSensorValues((prev) => ({ ...prev, humidity: Number(payload) || prev.humidity }));
      }
      if (topic === MQTT_TOPICS.light) {
        setSensorValues((prev) => ({ ...prev, light: Number(payload) || prev.light }));
      }
      if (topic === MQTT_TOPICS.led1) {
        updateLedState(1, payload.toUpperCase() === 'ON');
      }
      if (topic === MQTT_TOPICS.led2) {
        updateLedState(2, payload.toUpperCase() === 'ON');
      }
    });

    client.on('error', () => {
      setBrokerConnected(false);
      setConnecting(false);
    });

    client.on('close', () => {
      setBrokerConnected(false);
      setConnecting(false);
    });
  };

  return (
    <div className="dashboard">
      {data?.error && (
        <div className="banner warn">
          ⚠️ {data.error} — Vui lòng bật backend (RESTful API) của bài 1 để kết nối thiết bị thật.
        </div>
      )}

      <section className="stats-row">
        <StatCard icon="🖥️" label="Tổng thiết bị" value={total} accent="blue" sub="Thiết bị kết nối hệ thống" />
        <StatCard icon="🟢" label="Đang hoạt động" value={online} accent="green" sub="Nhận dữ liệu gần đây" />
        <StatCard icon="🔴" label="Ngừng hoạt động" value={offline} accent="red" sub="Mất kết nối" />
        <StatCard
          icon="🔄"
          label="Cập nhật lần cuối"
          value={data?.fetchedAt ? timeAgo(data.fetchedAt, now) : '--'}
          accent="purple"
          sub={`Tự động mỗi ${APP_CONFIG.pollIntervalMs / 1000} giây`}
        />
      </section>

      <div className="dash-grid">
        <div className="dash-main">
          <section className="panel connection-panel">
            <div className="panel-head">
              <h3>📡 MQTT Broker</h3>
              <span className={`status-pill ${brokerConnected ? 'online' : 'offline'}`}>
                {brokerConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="connection-row">
              <label className="field">
                <span>Host</span>
                <input value={brokerHost} onChange={(e) => setBrokerHost(e.target.value)} placeholder="192.168.1.xxx" />
              </label>

              <label className="field">
                <span>Port</span>
                <input type="number" value={brokerPort} onChange={(e) => setBrokerPort(e.target.value)} min="1" max="65535" />
              </label>

              <button type="button" className="primary-btn" onClick={connectBroker} disabled={connecting}>
                {connecting ? 'Connecting...' : brokerConnected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>🌡️ Dữ liệu cảm biến hiện tại</h3>
              <span className="muted small">Temperature • Humidity • Light</span>
            </div>

            <div className="metrics-grid">
              <article className="metric-card ambient">
                <div className="metric-icon">🌡️</div>
                <div>
                  <p>Temperature</p>
                  <h3>{sensorValues.temperature}°C</h3>
                </div>
              </article>

              <article className="metric-card humidity">
                <div className="metric-icon">💧</div>
                <div>
                  <p>Humidity</p>
                  <h3>{sensorValues.humidity}%</h3>
                </div>
              </article>

              <article className="metric-card light">
                <div className="metric-icon">💡</div>
                <div>
                  <p>Light</p>
                  <h3>{sensorValues.light} lux</h3>
                </div>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>💡 Điều khiển đèn LED</h3>
              <span className="muted small">2 đèn vận hành qua MQTT</span>
            </div>

            <div className="device-item-list">
              {leds.map((led) => (
                <div key={led.id} className="device-item">
                  <div>
                    <p className="device-name">{led.name}</p>
                    <span className="device-subtitle">{led.status ? 'Đang bật' : 'Đang tắt'}</span>
                  </div>
                  <button
                    type="button"
                    className={`toggle-btn ${led.status ? 'on' : 'off'}`}
                    onClick={() => toggleLed(led.id)}
                  >
                    {led.status ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="dash-side">
          <section className="panel">
            <div className="panel-head">
              <h3>👥 Thông tin nhóm</h3>
            </div>
            <div className="group-info">
              <p>
                <strong>{APP_CONFIG.group.groupName}</strong>
                <span className="muted">{APP_CONFIG.group.className}</span>
              </p>
              <ul className="member-list">
                {APP_CONFIG.group.members.map((m) => (
                  <li key={m.mssv}>
                    <span className="avatar">🧑‍🎓</span>
                    <span className="member-name">{m.name}</span>
                    <span className="muted small">{m.mssv}</span>
                  </li>
                ))}
              </ul>
              <div className="group-footer">
                <span className="muted small">GVHD: {APP_CONFIG.group.gvhd}</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>ℹ️ Thông tin hệ thống</h3>
            </div>
            <ul className="sys-list">
              <li>
                <span>Thiết bị</span>
                <strong>2 × Wemos D1</strong>
              </li>
              <li>
                <span>Cảm biến</span>
                <strong>DHT22/DHT11, BH1750</strong>
              </li>
              <li>
                <span>Dữ liệu</span>
                <strong>Nhiệt độ • Độ ẩm • Ánh sáng</strong>
              </li>
              <li>
                <span>Nguồn dữ liệu</span>
                <strong className={data?.source === 'api' ? 'text-green' : 'text-warn'}>
                  {data?.source === 'api' ? 'RESTful API thật' : 'Mô phỏng (mock)'}
                </strong>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}