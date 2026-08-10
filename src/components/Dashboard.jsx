import React from 'react';
import { APP_CONFIG } from '../config.js';
import StatCard from './StatCard.jsx';
import DeviceCard from './DeviceCard.jsx';
import SensorOverview from './SensorOverview.jsx';
import { isActive, timeAgo } from '../utils/format.js';

export default function Dashboard({ data }) {
  const now = Date.now();
  const devices = data?.devices ?? [];
  const sensors = data?.sensors ?? [];

  const total = devices.length;
  const online = devices.filter((d) => isActive(d, now)).length;
  const offline = total - online;

  return (
    <div className="dashboard">
      {data?.error && (
        <div className="banner warn">
          ⚠️ {data.error} — Vui lòng bật backend (RESTful API) của bài 1 để kết nối thiết bị thật.
        </div>
      )}

      {/* Thống kê nhanh */}
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
          {/* Tình trạng thiết bị */}
          <section className="panel">
            <div className="panel-head">
              <h3>📟 Tình trạng thiết bị kết nối</h3>
              <span className="muted small">Số lượng thiết bị: {total} (tối thiểu 2)</span>
            </div>
            <div className="device-grid">
              {devices.length === 0 ? (
                <p className="muted">Chưa có thiết bị nào kết nối.</p>
              ) : (
                devices.map((d) => <DeviceCard key={d.deviceId} device={d} now={now} />)
              )}
            </div>
          </section>

          {/* Dữ liệu cảm biến */}
          <section className="panel">
            <div className="panel-head">
              <h3>🌡️ Dữ liệu cảm biến hiện tại</h3>
              <span className="muted small">Nhiệt độ • Độ ẩm • Ánh sáng</span>
            </div>
            <SensorOverview sensors={sensors} />
          </section>
        </div>

        {/* Cột phụ: thông tin nhóm */}
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