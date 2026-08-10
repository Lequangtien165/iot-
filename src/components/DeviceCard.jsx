import React from 'react';
import { isActive, formatTime, timeAgo } from '../utils/format.js';

// ===== Thẻ hiển thị tình trạng một thiết bị =====
// Hiển thị: tên thiết bị, còn hoạt động hay không?, lần cuối cùng kết nối.
export default function DeviceCard({ device, now }) {
  const active = isActive(device, now);
  const sensorCount = device.sensors ? device.sensors.length : null;

  return (
    <div className={`device-card ${active ? 'ok' : 'off'}`}>
      <div className="device-head">
        <div className={`device-avatar ${active ? 'online' : 'offline'}`}>📟</div>
        <div>
          <h4 className="device-name">{device.deviceName}</h4>
          <div className="device-meta">
            {device.deviceType && <span className="chip">{device.deviceType}</span>}
            {device.ipAddress && <span className="muted small">IP: {device.ipAddress}</span>}
          </div>
        </div>
      </div>

      <div className="device-status-row">
        <span className={`status-badge ${active ? 'online' : 'offline'}`}>
          <span className="pulse-dot" />
          {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
        <span className="muted small">
          {active
            ? sensorCount
              ? `Gửi ${sensorCount} loại dữ liệu`
              : 'Đang kết nối hệ thống'
            : 'Không nhận được dữ liệu'}
        </span>
      </div>

      <div className="device-last">
        <span className="muted">Lần cuối kết nối:</span>
        <strong>{timeAgo(device.lastConnect, now)}</strong>
        <span className="muted small">{formatTime(device.lastConnect)}</span>
      </div>
    </div>
  );
}