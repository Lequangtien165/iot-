import React from 'react';
import { APP_CONFIG } from '../config.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
  { id: 'main', label: 'Màn hình chính', icon: '🎛️', active: false },
  { id: 'chart', label: 'Biểu đồ', icon: '📈', active: false },
  { id: 'logs', label: 'Logs', icon: '📜', active: false },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">🌐</div>
        <div>
          <strong>IoT Dashboard</strong>
          <span className="muted">Lab 04 - UIT</span>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${item.active ? 'active' : ''}`}
            title={item.active ? '' : 'Chưa phát triển trong bài này'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {!item.active && <span className="soon">sắp có</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="muted">GVHD: {APP_CONFIG.group.gvhd}</span>
        <span className="muted small">Công nghệ IoT hiện đại</span>
      </div>
    </aside>
  );
}