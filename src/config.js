// ===== Cấu hình chung của ứng dụng =====
// Sửa các thông tin dưới đây cho phù hợp với nhóm của bạn.

export const APP_CONFIG = {
  // Tên người dùng được chào mừng trên Dashboard
  userName: 'Admin',

  // Thông tin nhóm thực hiện
  group: {
    className: 'NT532',
    groupName: 'Nhóm 1',
    gvhd: 'Lê Phạm Hoàng Trung',
    members: [
      { mssv: '23521572', name: 'Lê Quang Tiến' },
      { mssv: '23521743', name: 'Nguyễn Quang Tùng' },
      { mssv: '23521525', name: 'Nguyễn Minh Thông' },
      { mssv: '24520759', name: 'Nguyễn Nhan Quốc Khang' },
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