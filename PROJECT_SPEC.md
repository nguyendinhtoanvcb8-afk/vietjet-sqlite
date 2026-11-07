# ĐẶC TẢ YÊU CẦU DỰ ÁN (PROJECT SPECIFICATION) - VIETJET

Tài liệu này định nghĩa chi tiết toàn bộ các tính năng, giao diện, luồng người dùng (User Flows) và kiến trúc kỹ thuật của website du lịch **Vietjet**.

---

## 1. TỔNG QUAN HỆ THỐNG
- **Tên dự án:** Website Đặt Vé Máy Bay & Tour Du Lịch Vietjet
- **Mục tiêu:** Xây dựng ứng dụng web đặt vé máy bay và tour du lịch hoàn chỉnh bằng HTML, CSS, JavaScript thuần, không dùng backend máy chủ.
- **Cơ chế lưu trữ:** Cơ sở dữ liệu quan hệ **SQLite** nhúng chạy bằng WebAssembly (`sql.js`) trực tiếp trong trình duyệt, đồng bộ hóa vào `localStorage`.
- **Hệ thống gửi Email:** Client-side email dispatch thông qua **EmailJS** gửi xác nhận từ địa chỉ `nvhai061993@gmail.com` đến email khách hàng.

---

## 2. GIAO DIỆN & MÀU SẮC THIẾT KẾ
- **Chủ đề chung:** Tươi sáng, tinh gọn, hiện đại, phong cách hàng không cao cấp.
- **Bảng màu (Color Palette):**
  - **Màu chủ đạo (Primary Red):** `#ee1d23` (Màu đỏ thương hiệu Vietjet Air).
  - **Màu nhấn (Accent Gold/Yellow):** `#ffc20e` / `#ffda44`.
  - **Màu nền (Background):** `#ffffff` (Nền chính trắng sáng), `#f8f9fa` (Section xám phụ).
  - **Màu văn bản (Text):** `#1e293b` (Đen than), `#64748b` (Xám phụ đề), `#ffffff` (Chữ trên nền đỏ).
  - **Thành công (Success):** `#10b981`.
  - **Cảnh báo/Hủy (Warning/Danger):** `#ef4444`.

---

## 3. CHI TIẾT TỪNG TRANG & TÍNH NĂNG

### 3.1. Header & Navigation (Dùng chung cho tất cả các trang)
- **Logo:** Biểu tượng và chữ "Vietjet" màu đỏ viền vàng đặc trưng.
- **Menu điều hướng:**
  - Trang Chủ (`index.html`)
  - Chuyến Bay (`flights.html`)
  - Tour Du Lịch (`tours.html`)
- **Icon Giỏ hàng:**
  - Hiển thị biểu tượng giỏ hàng với **Badge số lượng** vé/tour đã chọn (cập nhật theo thời gian thực).
  - Click dẫn tới trang Giỏ Hàng (`cart.html`).
- **Nút liên hệ / Hotline:** `1900 1886` hoặc nút hỗ trợ nhanh.

---

### 3.2. Trang Chủ (`index.html`)
Gồm 3 khối nội dung trọng tâm:

#### A. Khối Tìm Kiếm Chuyến Bay (Hero Booking Widget)
- **Loại vé:** Radio button / Tab chọn: *Khứ hồi (Round-trip)* hoặc *Một chiều (One-way)*.
- **Điểm xuất phát (Origin):** Dropdown chọn thành phố/sân bay (TP. Hồ Chí Minh - SGN, Hà Nội - HAN, Đà Nẵng - DAD, Phú Quốc - PQC, Nha Trang - CXR, Singapore - SIN, Bangkok - BKK, Seoul - ICN...).
- **Điểm đến (Destination):** Dropdown chọn điểm đến tương ứng.
- **Ngày đi (Departure Date):** Date picker (mặc định hôm nay hoặc ngày mai).
- **Ngày về (Return Date):** Date picker (tự động disable khi chọn "Một chiều").
- **Số lượng hành khách & Hạng ghế:** Người lớn, trẻ em, phổ thông / thương gia.
- **Nút "Tìm Kiếm":** 
  - Validate dữ liệu đầu vào (Điểm đi khác điểm đến, ngày đi hợp lệ).
  - Điều hướng sang `flights.html` kèm tham số URL query (`?from=SGN&to=HAN&date=...&type=roundtrip`).

#### B. Khối Tour Du Lịch Nổi Bật (Featured Tours)
- **Số lượng:** Hiển thị đúng **8 tour du lịch nổi bật** lấy từ CSDL SQLite.
- **Quy chuẩn mỗi Card Tour:**
  - Ảnh đại diện Thumbnail chuẩn kích thước **600x400 px** (sắc nét, tỉ lệ 3:2).
  - Tên hãng du lịch / hàng không đồng hành (Vietjet Travel, Vietravel, Saigontourist...).
  - Thời lượng: Số ngày / đêm (ví dụ: `4N3Đ`, `3N2Đ`, `5N4Đ`).
  - Điểm khởi hành & điểm đến.
  - Giá tour: Định dạng tiền tệ VNĐ (ví dụ: `4.590.000 ₫`).
  - Nút "Xem Chi Tiết" hoặc click cả thẻ: Điều hướng sang trang Chi tiết Tour (`tour-detail.html?id=...`).

#### C. Khối Các Hãng Hàng Không Đối Tác (Airlines Showcase)
- Hiển thị danh sách logo và tên các hãng hàng không uy tín:
  - **VietJet Air**
  - **Vietnam Airlines**
  - **Singapore Airlines**
  - **Bamboo Airways**
  - **Thai Airways**
  - **Korean Air**
- **Hành vi tương tác:** Click vào logo hãng nào sẽ tự động chuyển hướng đến trang `flights.html?airline=VietJet%20Air` với bộ lọc hãng bay đã được chọn sẵn.

---

### 3.3. Trang Chuyến Bay (`flights.html`)
Giao diện chia làm 2 cột:

#### A. Cột bên trái: Bộ lọc (Filter Sidebar)
- **Sắp xếp theo giá:** Tăng dần / Giảm dần.
- **Loại hình chuyến bay:** Khứ hồi, một chiều, bay thẳng (Direct), nhiều thành phố (Multi-city).
- **Hãng hàng không:** Checkbox chọn nhiều hãng (VietJet Air, Vietnam Airlines, Singapore Airlines...).
- **Thời gian cất cánh (Giờ):** Range slider hoặc checkbox khung giờ (Sáng sớm 00:00 - 06:00, Sáng 06:00 - 12:00, Chiều 12:00 - 18:00, Tối 18:00 - 24:00).
- **Hạng dịch vụ:** Phổ thông (Economy), Thương gia (Business).
- **Nút "Đặt lại bộ lọc" (Reset filter).**

#### B. Cột bên phải: Danh sách chuyến bay (Flight Cards)
- Hiển thị danh sách chuyến bay thỏa mãn điều kiện lọc từ SQLite.
- Thông tin mỗi thẻ chuyến bay:
  - Logo hãng bay và mã hiệu chuyến (VJ-128, VN-210...).
  - Giờ cất cánh & Giờ hạ cánh (kèm tên sân bay).
  - Tổng thời gian bay (ví dụ: `2h 10m`).
  - Trạng thái: Bay thẳng / Điểm dừng.
  - Dịch vụ bao gồm: Hành lý xách tay 7kg, suất ăn nhẹ, giải trí trên chuyến bay.
  - Giá vé tốt nhất hiển thị rõ ràng bằng màu đỏ `#ee1d23`.
  - Nút **"Chọn Chuyến Bay"**: Điều hướng tới `flight-detail.html?flightId=...`.

---

### 3.4. Trang Chi Tiết Chuyến Bay (`flight-detail.html`)
- **Thông tin chặng bay:**
  - Điểm đi - Điểm đến (mã sân bay, tên thành phố, nhà ga).
  - Giờ bay, giờ đáp, tổng thời gian bay.
  - Hãng hàng không khai thác.
  - Loại máy bay (Boeing 787 Dreamliner, Airbus A321neo, Airbus A350...).
- **Khu vực lựa chọn Hạng Vé (Ticket Class Comparison):**
  - **Hạng Phổ Thông (Economy Class):**
    - Giá vé niêm yết.
    - Quyền lợi: 7kg hành lý xách tay, ghế tiêu chuẩn, hỗ trợ đổi vé có phí, hoàn vé có điều kiện.
    - Nút chọn "Chọn Hạng Phổ Thông".
  - **Hạng Thương Gia (Business Class):**
    - Giá vé cao cấp (gấp ~2.5 - 3 lần).
    - Quyền lợi: 14kg xách tay + 30kg ký gửi, phòng chờ thương gia Lotus/VIP lounge, ưu tiên check-in & lên tàu bay, ghế ngả thành giường phẳng, suất ăn nóng ẩm thực 5 sao, miễn phí đổi vé.
    - Nút chọn "Chọn Hạng Thương Gia".
- **Hành vi khi bấm "Chọn":**
  - Thêm vé máy bay với hạng ghế tương ứng vào **Giỏ Hàng** (lưu vào SQLite / `localStorage`).
  - Hiển thị Toast thông báo thành công.
  - Tự động chuyển hướng hoặc cung cấp nút sang `cart.html`.

---

### 3.5. Trang Tour Du Lịch (`tours.html`)
Giao diện 2 cột tương tự trang chuyến bay:
#### A. Cột bên trái: Bộ lọc Tour
- Sắp xếp giá: Tăng dần / Giảm dần.
- Lọc theo hãng hàng không vận chuyển trong tour.
- Lọc theo thời gian cất cánh / số ngày đi (Dưới 3 ngày, 3-5 ngày, trên 5 ngày).
- Lọc theo điểm đến (Miền Bắc, Miền Trung, Miền Nam, Quốc tế).

#### B. Cột bên phải: Danh sách Tour du lịch
- Hiển thị danh sách Tour dạng lưới hoặc thẻ danh sách.
- Thông tin: Ảnh 600x400, tên tour, hãng bay, ngày khởi hành, thời lượng tour, giá tour trọn gói, danh sách dịch vụ (khách sạn 4-5 sao, xe đưa đón, bảo hiểm, bữa ăn).
- Click nút **"Xem Chi Tiết Tour"** -> dẫn tới `tour-detail.html?tourId=...`.

---

### 3.6. Trang Chi Tiết Tour (`tour-detail.html`)
- **Tổng quan chuyến bay đi kèm:** Điểm đi, điểm đến, hãng hàng không, loại máy bay vận chuyển.
- **Thư viện ảnh:** Hình ảnh điểm đến sắc nét 600x400.
- **Lịch trình chuyến đi chi tiết (Day-by-Day Itinerary):**
  - Trình bày dạng Timeline chuyên nghiệp:
    - *Ngày 1:* Khởi hành, đáp sân bay, nhận phòng khách sạn, tham quan danh thắng A.
    - *Ngày 2:* Khám phá văn hóa bản địa, thưởng thức ẩm thực đặc sản.
    - *Ngày 3:* Vui chơi tự do, mua sắm quà lưu niệm, đáp chuyến bay về.
- **Chính sách tour:** Bao gồm & không bao gồm (vé máy bay, phòng ở, bảo hiểm, vé tham quan).
- **Nút "Đặt Tour / Thêm Vào Giỏ Hàng":**
  - Lưu tour vào giỏ hàng và điều hướng tới `cart.html`.

---

### 3.7. Trang Giỏ Hàng & Thanh Toán (`cart.html`)
Trang quan trọng nhất hoàn thiện phễu đặt chỗ:
#### A. Danh sách dịch vụ đã chọn (Cart Items)
- Bảng hiển thị tất cả các Chuyến bay và Tour du lịch đã chọn.
- Mỗi mục gồm: Tên chuyến bay/tour, loại vé/hạng ghế, ngày khởi hành, đơn giá, số lượng, thành tiền.
- Nút **"Xóa" (Remove item)** cho từng dòng.
- Nút **"Xóa toàn bộ giỏ hàng" (Clear all)**.
- Khung tổng kết: Tạm tính, Thuế & Phí (VAT 8%), **Tổng tiền thanh toán cuối cùng**.

#### B. Biểu mẫu thông tin cá nhân khách hàng (Customer Information Form)
- Họ và tên người đặt (bắt buộc).
- Số điện thoại di động (validate 10 chữ số).
- Địa chỉ Email (bắt buộc, validate định dạng email để nhận xác nhận).
- Số CCCD/Hộ chiếu (tùy chọn hoặc bắt buộc với chuyến bay).
- Ghi chú yêu cầu đặc biệt (suất ăn chay, ghế ngồi gần cửa sổ, hỗ trợ xe lăn...).

#### C. Hành động "Đăng Ký Đặt Chỗ" (Checkout Action)
1. Kiểm tra tính hợp lệ của Form (Form validation).
2. Lưu bản ghi đơn đặt chỗ (Booking) vào bảng `bookings` trong cơ sở dữ liệu SQLite.
3. Kích hoạt dịch vụ gửi Email thông qua **EmailJS**:
   - Gửi từ: `nvhai061993@gmail.com`
   - Gửi đến: Email của khách hàng vừa nhập.
   - Nội dung Email: Mã đặt chỗ (Booking Reference Code), Chi tiết vé máy bay/tour đã đặt, Hạng vé, Tổng số tiền thanh toán, Lời cảm ơn và hướng dẫn thanh toán/check-in.
4. Hiển thị **Modal Thông Báo Hoàn Thành** ấn tượng:
   - Dấu tích xanh thành công.
   - Mã đặt chỗ (ví dụ: `VJ-BOOK-89217`).
   - Thông báo: *"Email xác nhận hành trình đã được gửi từ nvhai061993@gmail.com tới [email khách hàng]. Vui lòng kiểm tra hộp thư!"*
5. Xóa sạch giỏ hàng sau khi đặt thành công và hiển thị nút "Về Trang Chủ".

---

## 4. QUY CHUẨN KỸ THUẬT CLIENT-SIDE
- **Không cài đặt NodeJS/Server:** Chạy trực tiếp bằng bất kỳ Static HTTP Server nào (như VS Code Live Server, Python `http.server`, hoặc mở trực tiếp trình duyệt).
- **SQLite Engine:** Sử dụng CDN chính thức `sql.js` WebAssembly (`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js`).
- **Lưu trữ nhũ hoá:** Toàn bộ file binary SQLite `.sqlite` được serialize thành `Uint8Array` và lưu vào `localStorage` key `vietjet_db_binary`.
- **Email Service:** EmailJS SDK CDN `https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js`.
