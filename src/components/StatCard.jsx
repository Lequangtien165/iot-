import React from 'react';

// ===== Thẻ thống kê nhanh ở đầu trang =====
export default function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div className={`stat-card ${accent || ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}