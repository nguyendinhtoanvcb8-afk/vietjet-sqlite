# Antigravity Project Instructions: Vietjet Travel Website

Bạn là Antigravity, trợ lý lập trình AI chuyên nghiệp. Bạn đang hỗ trợ phát triển dự án website du lịch **Vietjet**.

## 1. Nguyên Tắc & Quy Chuẩn Dự Án
- **Tên dự án:** Vietjet Travel & Flight Booking Portal.
- **Công nghệ cốt lõi:**
  - **HTML5:** Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - **CSS3:** CSS thuần hiện đại (CSS Variables, Flexbox, CSS Grid, Responsive Mobile-first). Không dùng Tailwind hay Bootstrap để đảm bảo tính thuần khiết và tốc độ tải trang tối ưu.
  - **JavaScript:** ES6+ thuần (Vanilla JS), module hóa rõ ràng (DOM helper, Database service, Cart service, Notification service).
  - **Không có Backend:** Toàn bộ logic chạy 100% phía Client (Trình duyệt).
  - **Cơ sở dữ liệu:** **SQLite** chạy trực tiếp trên trình duyệt thông qua **sql.js (WebAssembly SQLite)**. Dữ liệu được đồng bộ và lưu trữ bền vững vào `localStorage` hoặc `IndexedDB`.
  - **Gửi Email:** Sử dụng thư viện **EmailJS** (hoặc tích hợp client-side API) để gửi email xác nhận đặt chỗ từ `nvhai061993@gmail.com` đến hòm thư khách hàng.

## 2. Hệ Thống Màu Sắc & Giao Diện (Design Tokens)
- **Màu chủ đạo (Primary):** `#ee1d23` (Đỏ Vietjet).
- **Màu phụ (Accent / Secondary):** `#ffc20e` (Vàng tươi Vietjet) hoặc `#f58220` (Cam ấm).
- **Màu nền (Background):** `#ffffff` (Nền trắng tinh khiết), `#f8f9fa` (Nền xám nhạt cho card / section phụ).
- **Màu chữ (Typography):**
  - Text chính: `#1a1a1a` (Đen đậm, dễ đọc).
  - Text phụ / Label: `#555555` hoặc `#777777`.
  - Border / Divider: `#e5e7eb`.
- **Hiệu ứng:** Đổ bóng nhẹ (`box-shadow: 0 4px 12px rgba(0,0,0,0.06)`), bo góc hiện đại (`border-radius: 8px - 12px`), hover mượt mà (`transition: all 0.3s ease`).

## 3. Cấu Trúc Thư Mục Dự Kiến
```text
d:/Toan/Vietjet/
├── index.html               # Trang chủ (Tìm vé, 8 tour nổi bật, hãng hàng không)
├── flights.html             # Danh sách chuyến bay & bộ lọc
├── flight-detail.html       # Chi tiết chuyến bay & chọn hạng vé (Phổ thông/Thương gia)
├── tours.html               # Danh sách tour du lịch & bộ lọc
├── tour-detail.html         # Chi tiết tour & lịch trình chi tiết
├── cart.html                # Giỏ hàng, thông tin hành khách & xác nhận gửi mail
├── css/
│   ├── style.css            # CSS dùng chung (Variables, Reset, Header, Footer, Button)
│   ├── home.css             # Style riêng trang chủ
│   ├── flights.css          # Style trang chuyến bay & chi tiết
│   ├── tours.css            # Style trang tour & chi tiết
│   └── cart.css             # Style giỏ hàng & modal thông báo
├── js/
│   ├── db.js                # Quản lý SQLite (sql.js WASM, tạo bảng, nạp seed data, query)
│   ├── cart.js              # Quản lý giỏ hàng (thêm, xóa, tính tổng, lưu trữ)
│   ├── email.js             # Xử lý gửi email xác nhận (EmailJS integration)
│   ├── main.js              # Script dùng chung (Header, Mobile menu, Cart counter)
│   ├── flights.js           # Xử lý logic lọc, tìm kiếm, hiển thị chuyến bay
│   └── tours.js             # Xử lý logic lọc, hiển thị danh sách & chi tiết tour
├── assets/
│   ├── images/              # Hình ảnh banner, thumbnails 600x400, logos hãng bay
│   └── icons/               # Icon SVG (máy bay, lịch, vali, checkmark, v.v.)
├── GEMINI.md                # File hướng dẫn cấu hình Antigravity (File này)
├── PROJECT_SPEC.md          # Đặc tả yêu cầu kỹ thuật & chức năng chi tiết
├── DATABASE_SCHEMA.md       # Cấu trúc CSDL SQLite & dữ liệu mẫu (Seed Data)
└── IMPLEMENTATION_PLAN.md   # Lộ trình từng bước thực hiện bằng Antigravity
```

## 4. Hướng Dẫn Dành Cho Antigravity Khi Viết Code
1. **Viết mã hoàn chỉnh, không dùng placeholder:** Khi tạo các trang HTML, CSS hoặc JS, cung cấp đầy đủ mã nguồn có thể chạy được ngay.
2. **Khởi tạo Database SQLite tự động:** Trong `db.js`, sử dụng thư viện CDN `sql.js` (WASM). Nếu chưa có CSDL trong `localStorage`, tự động nạp `DATABASE_SCHEMA.md` với đầy đủ các hãng bay, 8 tour nổi bật, các chuyến bay mẫu.
3. **Responsive Design:** Mọi trang đều phải hiển thị chuẩn xác trên cả Mobile (375px+), Tablet (768px+) và Desktop (1200px+).
4. **Trải nghiệm người dùng mượt mà:**
   - Cung cấp visual feedback khi click (nút loading, badge số lượng trên giỏ hàng).
   - Modal thông báo thành công đẹp mắt sau khi đặt vé/tour.
   - Các hình ảnh mẫu sử dụng placeholder Unsplash chuẩn kích thước 600x400 chất lượng cao.
