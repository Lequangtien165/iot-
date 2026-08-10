import React from 'react';
import { APP_CONFIG } from '../config.js';
import { formatClock } from '../utils/format.js';

// ===== Thanh trên cùng: lời chào, thông tin nhóm, đồng hồ thời gian thực =====
export default function Topbar({ dataSource }) {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">Dashboard</h2>
        <p className="welcome">
          Xin chào, <strong>{APP_CONFIG.userName}</strong>! Chào mừng bạn đến với hệ thống
          quản lý IoT.
        </p>
      </div>

      <div className="topbar-right">
        <div className="group-badge" title="Thông tin nhóm thực hiện">
          <span className="group-icon">👥</span>
          <div className="group-text">
            <strong>{APP_CONFIG.group.groupName}</strong>
            <span className="muted">{APP_CONFIG.group.className}</span>
          </div>
        </div>

        <div className="clock">
          <span className="clock-icon">🕒</span>
          <span>{formatClock(now)}</span>
        </div>

        <span
          className={`source-pill ${dataSource === 'api' ? 'online' : 'offline'}`}
          title={dataSource === 'api' ? 'Đang lấy dữ liệu từ RESTful API thật' : 'Chưa có dữ liệu nguồn'}
        >
          {dataSource === 'api' ? '● RESTful API' : '◌ Chưa đồng bộ'}
        </span>
      </div>
    </header>
  );
}