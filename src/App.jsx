import React, { useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import usePolling from './hooks/usePolling.js';
import { getDashboardSnapshot } from './api/api.js';
import { APP_CONFIG } from './config.js';

export default function App() {
  const fetchData = useCallback(() => getDashboardSnapshot(), []);
  const { data, loading } = usePolling(fetchData, APP_CONFIG.pollIntervalMs);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar dataSource={data?.source} />
        <main className="page">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Đang tải dữ liệu từ hệ thống...</p>
            </div>
          ) : (
            <Dashboard data={data} />
          )}
        </main>
      </div>
    </div>
  );
}