# KẾ HOẠCH TRIỂN KHAI TỪNG BƯỚC (IMPLEMENTATION PLAN) CHO ANTIGRAVITY

Tài liệu này cung cấp các Prompt chi tiết theo từng giai đoạn (Phase). Bạn chỉ cần copy từng prompt và gửi cho Antigravity để xây dựng từng tính năng một cách hoàn hảo và có trật tự.

---

## 🗺️ LỘ TRÌNH 6 BƯỚC THỰC HIỆN (PHASE ROADMAP)

| Bước | Nội dung triển khai | File chính liên quan |
| :--- | :--- | :--- |
| **Giai đoạn 1** | Khởi tạo Khung dự án, CSS Design System, Database SQLite (`sql.js`) | `css/style.css`, `js/db.js`, `js/cart.js`, `js/main.js` |
| **Giai đoạn 2** | Xây dựng Trang chủ (`index.html`): Form tìm kiếm, 8 Tour nổi bật, Logo Hãng bay | `index.html`, `css/home.css` |
| **Giai đoạn 3** | Xây dựng Trang Danh sách Chuyến Bay & Bộ Lọc Nâng Cao (`flights.html`) | `flights.html`, `css/flights.css`, `js/flights.js` |
| **Giai đoạn 4** | Xây dựng Trang Chi tiết Chuyến Bay (`flight-detail.html`) chọn hạng vé | `flight-detail.html` |
| **Giai đoạn 5** | Xây dựng Trang Tour (`tours.html`) & Trang Chi Tiết Tour (`tour-detail.html`) | `tours.html`, `tour-detail.html`, `css/tours.css`, `js/tours.js` |
| **Giai đoạn 6** | Xây dựng Giỏ hàng, Form đăng ký, Tích hợp gửi Email từ `nvhai061993@gmail.com` | `cart.html`, `css/cart.css`, `js/email.js` |

---

## 🎯 CÁC PROMPT MẪU ĐỂ RA LỆNH CHO ANTIGRAVITY

### 📌 PROMPT GIAI ĐOẠN 1: Core System & SQLite WebAssembly Setup
> **Cách dùng:** Copy toàn bộ nội dung trong khung dưới đây và dán vào ô chat với Antigravity.

```markdown
Chào Antigravity, hãy bắt đầu triển khai Giai đoạn 1 cho dự án website du lịch Vietjet theo tài liệu PROJECT_SPEC.md và DATABASE_SCHEMA.md:

1. Tạo file `css/style.css`:
   - Chứa toàn bộ CSS Reset, biến CSS (Variables: --primary: #ee1d23, --secondary: #ffc20e, --bg-light: #ffffff, --bg-sub: #f8f9fa, --text-main: #1e293b, --border: #e2e8f0).
   - Thiết kế chung cho Header (Logo Vietjet, Menu điều hướng, Icon Giỏ hàng kèm Badge số lượng, Hotline) và Footer phong cách du lịch chuyên nghiệp.
   - Các class tiện ích (buttons, badges, modals, cards, toast).

2. Tạo file `js/db.js`:
   - Sử dụng thư viện `sql.js` (WebAssembly SQLite) nạp từ CDN.
   - Khởi tạo và nạp toàn bộ cấu trúc bảng và Seed Data từ DATABASE_SCHEMA.md vào database SQLite.
   - Lưu trữ và đồng bộ trạng thái database vào `localStorage`.
   - Cung cấp các hàm helper: `queryFlights(filters)`, `getFeaturedTours()`, `getFlightById(id)`, `getTourById(id)`, `insertBooking(bookingData)`.

3. Tạo file `js/cart.js`:
   - Quản lý giỏ hàng phía client (lưu vào bảng `cart_items` trong SQLite và localStorage).
   - Cung cấp các hàm: `addToCart(item)`, `removeFromCart(id)`, `getCartItems()`, `clearCart()`, `updateCartBadge()`.

4. Tạo file `js/main.js`:
   - Xử lý menu mobile, đồng bộ số lượng giỏ hàng trên Header của mọi trang khi tải trang.
```

---

### 📌 PROMPT GIAI ĐOẠN 2: Trang Chủ (Home Page - `index.html`)

```markdown
Chào Antigravity, hãy triển khai Giai đoạn 2: Tạo trang chủ `index.html` và file `css/home.css`:

1. Header & Hero Banner:
   - Banner màu đỏ vàng năng động với thông điệp bay đẳng cấp cùng Vietjet.
   - Form Tìm Chuyến Bay thông minh (Search Widget):
     + Chọn loại vé: Khứ hồi / Một chiều.
     + Dropdown Điểm đi & Điểm đến (Hồ Chí Minh, Hà Nội, Đà Nẵng, Phú Quốc, Singapore, Bangkok...).
     + Chọn Ngày đi và Ngày về (disable khi chọn một chiều).
     + Nút "Tìm Kiếm" màu đỏ (#ee1d23): Khi click sẽ kiểm tra dữ liệu và chuyển hướng sang `flights.html?from=...&to=...&type=...`.

2. Khối 8 Tour Du Lịch Nổi Bật:
   - Truy vấn đúng 8 tour từ SQLite thông qua `window.vietjetDB.getFeaturedTours()`.
   - Mỗi card tour hiển thị: Ảnh 600x400 (từ seed data), Hãng bay/du lịch, số ngày đêm (ví dụ: 4N3Đ), giá tiền màu đỏ đậm, nút "Xem Chi Tiết" dẫn đến `tour-detail.html?tourId=...`.
   - Bố cục lưới Responsive Grid (4 cột trên Desktop, 2 cột Tablet, 1 cột Mobile).

3. Khối Hãng Hàng Không Đối Tác:
   - Hiển thị logo và tên các hãng: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways...
   - Click vào logo sẽ dẫn đến `flights.html?airline=VietJet%20Air` với bộ lọc hãng bay đã được chọn sẵn.

4. Footer chuẩn thông tin hàng không & du lịch.
```

---

### 📌 PROMPT GIAI ĐOẠN 3: Trang Danh Sách Chuyến Bay (`flights.html`)

```markdown
Chào Antigravity, hãy tạo trang `flights.html`, `css/flights.css` và `js/flights.js`:

1. Cột bên trái (Bộ lọc - Filter Sidebar):
   - Sắp xếp giá: Tăng dần / Giảm dần.
   - Loại vé: Khứ hồi, một chiều, bay thẳng, nhiều thành phố.
   - Hãng hàng không: Checkbox chọn nhiều hãng (VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways).
   - Giờ cất cánh: Các khung giờ (Sáng sớm 00h-06h, Sáng 06h-12h, Chiều 12h-18h, Tối 18h-24h).
   - Hạng dịch vụ: Phổ thông (Economy), Thương gia (Business).

2. Cột bên phải (Danh sách chuyến bay):
   - Nhận query params từ URL (nếu có từ trang chủ hoặc click logo hãng) để tự động tick bộ lọc.
   - Đọc dữ liệu chuyến bay từ CSDL SQLite qua `db.js`.
   - Thẻ chuyến bay hiện: Giờ bay, giờ đáp, mã chuyến bay, logo hãng, thời gian bay, dịch vụ bao gồm, giá vé tốt nhất.
   - Nút "Chọn Chuyến Bay" -> dẫn sang `flight-detail.html?flightId=...`.
   - Tự động lọc lại kết quả theo thời gian thực khi người dùng thay đổi bất kỳ tiêu chí nào ở Sidebar.
```

---

### 📌 PROMPT GIAI ĐOẠN 4: Trang Chi Tiết Chuyến Bay (`flight-detail.html`)

```markdown
Chào Antigravity, hãy tạo trang `flight-detail.html`:

1. Lấy thông tin chuyến bay theo `flightId` từ URL bằng SQLite query.
2. Hiển thị thông tin hành trình:
   - Sân bay đi, Sân bay đến, Giờ cất cánh/hạ cánh, Tổng thời gian bay.
   - Hãng hàng không khai thác, Mã hiệu chuyến bay.
   - Loại máy bay hiện đại: Boeing 787 Dreamliner, Airbus A321neo...
3. Khối Chọn Hạng Vé (Ticket Class Comparison) so sánh 2 cột trực quan:
   - Cột 1: Hạng Phổ Thông (Economy) - Giá vé gốc, 7kg xách tay, đồ uống, ghế tiêu chuẩn. Nút "Chọn Hạng Phổ Thông".
   - Cột 2: Hạng Thương Gia (Business) - Giá vé VIP, 14kg xách tay + 30kg ký gửi, phòng chờ VIP Lotus, suất ăn nóng 5 sao, ghế ngả thành giường phẳng, ưu tiên check-in. Nút "Chọn Hạng Thương Gia".
4. Hành vi khi bấm nút:
   - Gọi `window.cartService.addToCart(...)` lưu vào CSDL SQLite và hiển thị Toast thông báo.
   - Tự động chuyển hướng sang `cart.html` sau 1 giây (hoặc có popup điều hướng).
```

---

### 📌 PROMPT GIAI ĐOẠN 5: Trang Tour & Chi Tiết Tour (`tours.html`, `tour-detail.html`)

```markdown
Chào Antigravity, hãy tạo trang danh sách tour `tours.html`, trang chi tiết `tour-detail.html`, `css/tours.css` và `js/tours.js`:

1. Trang `tours.html`:
   - Bên trái: Bộ lọc sắp xếp giá tăng/giảm dần, lọc theo hãng bay đối tác, thời lượng tour (ngày/đêm).
   - Bên phải: Danh sách các tour với ảnh 600x400, tên tour, điểm đến, hãng bay, thời gian bay, giá trọn gói.
   - Nút "Xem Chi Tiết Tour" -> dẫn tới `tour-detail.html?tourId=...`.

2. Trang `tour-detail.html`:
   - Hiển thị đầy đủ thông tin: Điểm đi, điểm đến, thời gian bay, hãng hàng không, loại máy bay (Boeing, Airbus...).
   - Hiển thị Lịch trình chuyến đi (Itinerary) dạng Timeline theo từng ngày (parse từ trường `itinerary_json` trong SQLite).
   - Danh sách dịch vụ bao gồm và không bao gồm.
   - Nút "Đặt Tour / Thêm Vào Giỏ Hàng" -> lưu vào Giỏ Hàng và chuyển hướng tới `cart.html`.
```

---

### 📌 PROMPT GIAI ĐOẠN 6: Trang Giỏ Hàng & Tích Hợp Gửi Email (`cart.html`, `js/email.js`)

```markdown
Chào Antigravity, hãy hoàn thiện Giai đoạn 6 với `cart.html`, `css/cart.css` và `js/email.js`:

1. Giao diện Giỏ Hàng:
   - Hiển thị toàn bộ Chuyến bay và Tour đã chọn từ SQLite `cart_items`.
   - Hiển thị chi tiết: Tên mục, Hạng vé, Đơn giá, Số lượng, Thành tiền.
   - Có nút "Xóa" từng mục và nút "Xóa Toàn Bộ Giỏ Hàng".
   - Cột tổng tiền: Tạm tính, Thuế VAT 8%, Tổng cộng thanh toán.

2. Biểu mẫu thông tin khách hàng (Checkout Form):
   - Nhập: Họ và tên, Số điện thoại, Địa chỉ Email (bắt buộc), Địa chỉ/Ghi chú.
   - Validate form không được để trống.

3. Xử lý "Đăng Ký Đặt Chỗ":
   - Lưu thông tin đơn vào bảng `bookings` trong CSDL SQLite.
   - Kích hoạt `js/email.js`: Cấu hình gửi email tự động bằng **EmailJS** từ `nvhai061993@gmail.com` đến Email khách hàng vừa nhập (kèm template mô tả chi tiết mã đặt chỗ, số tiền, hành trình). Có fallback mô phỏng nếu chưa điền EmailJS Key.
   - Hiển thị Modal Popup "Hoàn Thành Đặt Chỗ Thành Công":
     + Icon tích xanh nổi bật.
     + Hiển thị Mã Đặt Chỗ (Booking Reference Code).
     + Thông báo: *"Email xác nhận đã được gửi từ nvhai061993@gmail.com tới [email của bạn]. Vui lòng kiểm tra hộp thư!"*
   - Xóa rỗng giỏ hàng sau khi đặt thành công.
```
