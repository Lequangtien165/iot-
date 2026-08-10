# Lab 04 - Build a Simple IoT Dashboard

Xây dựng giao diện ứng dụng (App UI) để tương tác với mô hình IoT, môn **Công nghệ Internet of Things hiện đại** - Khoa Mạng máy tính và Truyền thông, UIT.

## Yêu cầu đã thực hiện (Bài 2 - Dashboard)

Dashboard hiển thị:

- **Thông tin chào mừng người sử dụng** (Xin chào, Admin!).
- **Thông tin nhóm** (tên nhóm, lớp, danh sách thành viên + MSSV).
- **Tình trạng thiết bị kết nối** đến hệ thống:
  - Tên thiết bị;
  - Thiết bị còn hoạt động hay không (Online/Offline - tự động nhận biết khi thiết bị ngừng gửi dữ liệu);
  - Lần cuối cùng kết nối (tương đối + chi tiết).
- Thống kê nhanh: tổng thiết bị, số thiết bị hoạt động/ngừng hoạt động, thời gian cập nhật.
- Dữ liệu cảm biến hiện tại (nhiệt độ, độ ẩm, ánh sáng) nhận từ các thiết bị.
- Dữ liệu được **tự động làm mới** mỗi vài giây (polling), sẵn sàng kết nối với RESTful API thật từ bài 1/3.

## Công nghệ sử dụng

- **React 18 + Vite** (JavaScript/JSX).
- **RESTful API** để lấy dữ liệu thiết bị, cảm biến và logs từ hệ thống.
- Tự động **fallback dữ liệu mô phỏng** khi chưa có backend để dễ demo.

## Hướng dẫn chạy

Yêu cầu: đã cài đặt **Node.js** (bản 18 trở lên).

```bash
cd code
npm install
npm run dev
```

Mở trình duyệt tại: http://localhost:5173

## Kết nối với RESTful API / thiết bị ở bài 1

Ứng dụng gọi các RESTful API sau (trả về dạng JSON `{ error, message, data }`):

| Endpoint            | Chức năng                         |
| ------------------- | --------------------------------- |
| `GET /api/devices`  | Danh sách thiết bị kết nối        |
| `GET /api/sensor/latest` | Giá trị cảm biến hiện tại    |
| `GET /api/logs`     | Lịch sử dữ liệu cảm biến (log)    |

Khi backend chạy trên cùng máy ở cổng `3000`, Vite sẽ proxy `/api` sang `http://localhost:3000` (xem `vite.config.js`). Nếu backend ở địa chỉ khác, sửa `apiBaseUrl` trong `src/config.js`.

Nếu không kết nối được API, ứng dụng tự chuyển sang **dữ liệu mô phỏng** mô tả 2 thiết bị:
1. **Wemos D1 - DHT22/DHT11**: đo nhiệt độ & độ ẩm.
2. **Wemos D1 - BH1750**: đo cường độ ánh sáng.

## Cấu trúc thư mục

```
code/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── config.js            # tên người dùng, thông tin nhóm, địa chỉ API
    ├── index.css
    ├── api/api.js           # gọi RESTful API (có fallback mock)
    ├── mock/mockData.js     # dữ liệu mô phỏng 2 thiết bị Wemos D1
    ├── hooks/usePolling.js  # tự động làm mới dữ liệu
    ├── utils/format.js      # định dạng thời gian, kiểm tra trạng thái thiết bị
    └── components/
        ├── Sidebar.jsx
        ├── Topbar.jsx       # lời chào + thông tin nhóm + đồng hồ
        ├── Dashboard.jsx    # màn hình Dashboard (bài 2)
        ├── StatCard.jsx
        ├── DeviceCard.jsx   # tình trạng từng thiết bị
        └── SensorOverview.jsx
```

## Tuỳ chỉnh

Sửa file `src/config.js` để cập nhật: tên người dùng, thông tin nhóm, địa chỉ RESTful API, chu kỳ làm mới, ngưỡng xác định thiết bị offline.