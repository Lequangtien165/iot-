import React from 'react';
import { formatValue } from '../utils/format.js';

const ICONS = { temperature: '🌡️', humidity: '💧', light: '☀️' };

// ===== Bảng dữ liệu cảm biến hiện tại (nhiệt độ, độ ẩm, ánh sáng) =====
export default function SensorOverview({ sensors }) {
  return (
    <div className="sensor-grid">
      {sensors.map((sensor) => (
        <div className="sensor-panel" key={sensor.deviceId}>
          <div className="sensor-head">
            <span className="chip">📟 {sensor.deviceName}</span>
            <span className="muted small">Giá trị hiện tại</span>
          </div>
          <div className="sensor-values">
            {(sensor.values || []).map((v) => (
              <div className="sensor-value" key={v.key}>
                <span className="sensor-icon">{ICONS[v.key] || '🔹'}</span>
                <div>
                  <span className="sensor-label">{v.name}</span>
                  <span className="sensor-number">
                    {formatValue(v.value)} <small>{v.unit}</small>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}