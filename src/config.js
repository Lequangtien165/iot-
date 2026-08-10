// ===== Cấu hình chung của ứng dụng =====
// Sửa các thông tin dưới đây cho phù hợp với nhóm của bạn.

export const APP_CONFIG = {
  // Tên người dùng được chào mừng trên Dashboard
  userName: 'Admin',

  // Thông tin nhóm thực hiện
  group: {
    className: 'KHMT2024',
    groupName: 'Nhóm 1',
    members: [
      { mssv: '20520001', name: 'Nguyễn Văn A' },
      { mssv: '20520002', name: 'Trần Thị B' },
    ],
  },

  // Địa chỉ RESTful API (API + Database ở bài 1 / bài 3)
  // Khi chạy backend trên cùng máy, có thể dùng '' để gọi qua proxy của Vite
  apiBaseUrl: '',

  // Khoảng thời gian (ms) tự động gọi lại dữ liệu từ hệ thống
  pollIntervalMs: 5000,

  // Khoảng thời gian (giây) không có dữ liệu mới thì coi thiết bị là offline
  offlineAfterSeconds: 60,
};