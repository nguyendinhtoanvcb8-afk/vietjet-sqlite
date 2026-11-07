# DỰ ÁN WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET (HƯỚNG DẪN DÙNG VỚI ANTIGRAVITY)

Chào mừng bạn đến với bộ tài liệu thiết kế và hướng dẫn phát triển website du lịch **Vietjet**. Bộ file markdown này được tối ưu hóa đặc biệt để **Antigravity** có thể đọc hiểu và sinh mã nguồn tự động, chuẩn xác 100% theo mọi yêu cầu bạn đưa ra.

---

## 📁 DANH SÁCH CÁC FILE .MD ĐÃ TẠO

| STT | Tên File | Chức Năng & Mục Đích |
| :---: | :--- | :--- |
| 1 | [`GEMINI.md`](file:///d:/Toan/Vietjet/GEMINI.md) | **Chỉ thị cốt lõi cho Antigravity**: Định nghĩa công nghệ (HTML/CSS/JS thuần, không backend), màu sắc chủ đạo (`#ee1d23`), kiến trúc thư mục và quy chuẩn viết code. Antigravity tự động đọc file này trong mỗi phiên làm việc. |
| 2 | [`PROJECT_SPEC.md`](file:///d:/Toan/Vietjet/PROJECT_SPEC.md) | **Đặc tả tính năng & giao diện chi tiết**: Mô tả từng trang (Trang chủ, Chuyến bay, Chi tiết chuyến bay chọn hạng vé, Tour du lịch, Chi tiết tour lịch trình, Giỏ hàng & Form gửi mail xác nhận). |
| 3 | [`DATABASE_SCHEMA.md`](file:///d:/Toan/Vietjet/DATABASE_SCHEMA.md) | **Cấu trúc CSDL SQLite & Dữ liệu mẫu (Seed Data)**: Định nghĩa các bảng `airlines`, `flights`, `tours`, `cart_items`, `bookings`, tích hợp thư viện SQLite WebAssembly (`sql.js`) và mẫu code kết nối `js/db.js`. |
| 4 | [`IMPLEMENTATION_PLAN.md`](file:///d:/Toan/Vietjet/IMPLEMENTATION_PLAN.md) | **Lộ trình thực hiện & Prompt mẫu**: Chia 6 giai đoạn phát triển với từng câu lệnh prompt chi tiết để bạn ra lệnh cho Antigravity sinh toàn bộ mã nguồn website. |

---

## 🎨 TÓM TẮT THIẾT KẾ & TÍNH NĂNG
- **Giao diện:** Tông màu sáng, nền trắng (`#ffffff`), màu sắc nhận diện thương hiệu đỏ Vietjet (`#ee1d23`) phối vàng rực rỡ (`#ffc20e`).
- **Trang chủ (`index.html`):**
  - Form tìm kiếm: Điểm đi, điểm đến, ngày bay, một chiều / khứ hồi -> Chuyển đến `flights.html`.
  - 8 Tour nổi bật: Ảnh 600x400, tên hãng, thời lượng (ngày/đêm), giá tour -> Chuyển đến `tours.html` / `tour-detail.html`.
  - Logo các hãng bay: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways... Click -> Lọc chuyến bay theo hãng.
- **Trang Chuyến bay (`flights.html`):**
  - Bộ lọc bên trái: Giá tăng/giảm dần, khứ hồi/một chiều, bay thẳng, nhiều thành phố, các hãng bay, giờ cất cánh, hạng dịch vụ (phổ thông/thương gia).
  - Danh sách bên phải: Giờ bay, thời gian bay, giá vé, dịch vụ -> Click sang trang chi tiết.
- **Trang Chi tiết chuyến bay (`flight-detail.html`):**
  - Thông tin máy bay (Boeing, Airbus...), giờ bay.
  - Chọn hạng vé: Hạng Phổ Thông vs Hạng Thương Gia (giá, hành lý, quyền lợi phòng chờ) -> Thêm vào Giỏ Hàng.
- **Trang Tour (`tours.html`) & Chi tiết Tour (`tour-detail.html`):**
  - Bộ lọc giá, hãng bay, giờ bay.
  - Lịch trình chuyến đi theo ngày (Itinerary Timeline).
  - Thêm tour vào Giỏ Hàng.
- **Trang Giỏ Hàng (`cart.html`):**
  - Quản lý danh sách chuyến bay & tour đã chọn, tính tổng tiền, xóa từng mục hoặc xóa tất cả.
  - Form nhập thông tin khách hàng.
  - Nút "Đăng ký" -> Bật thông báo thành công.
  - Gửi email xác nhận từ `nvhai061993@gmail.com` đến email khách hàng (sử dụng EmailJS Client-side SDK).

---

## 🚀 CÁCH SỬ DỤNG VỚI ANTIGRAVITY

Bạn có 2 lựa chọn để tiến hành:

### Cách 1: Cho Antigravity tạo tự động toàn bộ website trong 1 lệnh duy nhất
Bạn chỉ cần gửi lệnh sau:
> *"Antigravity ơi, hãy đọc file `GEMINI.md`, `PROJECT_SPEC.md`, `DATABASE_SCHEMA.md` và `IMPLEMENTATION_PLAN.md` rồi tiến hành sinh toàn bộ mã nguồn HTML, CSS, JavaScript cho toàn bộ dự án Vietjet ngay bây giờ."*

### Cách 2: Triển khai theo từng giai đoạn (Khuyên dùng)
Mở file [`IMPLEMENTATION_PLAN.md`](file:///d:/Toan/Vietjet/IMPLEMENTATION_PLAN.md) và lần lượt copy từng Prompt từ **Giai đoạn 1** đến **Giai đoạn 6** dán vào chat để cùng Antigravity kiểm tra từng trang một cách tỉ mỉ.
