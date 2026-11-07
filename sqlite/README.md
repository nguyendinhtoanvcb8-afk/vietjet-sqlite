# THƯ MỤC CƠ SỞ DỮ LIỆU SQLITE (VIETJET SQLITE DATABASE)

Thư mục này chứa toàn bộ các file mã nguồn SQL (`.sql`) được chuẩn hóa cho **SQLite** để phục vụ dự án website Vietjet.

---

## 📁 DANH SÁCH FILE .SQL

| Tên File | Chức năng & Mục đích |
| :--- | :--- |
| [`schema.sql`](file:///d:/Toan/Vietjet/sqlite/schema.sql) | **Định nghĩa cấu trúc DDL**: Khởi tạo 5 bảng (`airlines`, `flights`, `tours`, `cart_items`, `bookings`) và các chỉ mục (Indexes) tăng tốc độ tìm kiếm. |
| [`seed.sql`](file:///d:/Toan/Vietjet/sqlite/seed.sql) | **Dữ liệu mẫu DML**: Nạp 4 hãng bay, đúng **8 tour nổi bật** (ảnh 600x400, lịch trình JSON chi tiết), 12 chuyến bay đa dạng thời gian & hạng ghế. |
| [`init.sql`](file:///d:/Toan/Vietjet/sqlite/init.sql) | **File tổng hợp (All-in-one)**: Kết hợp cả tạo bảng + nạp dữ liệu trong 1 file duy nhất để chạy nhanh. |
| [`queries.sql`](file:///d:/Toan/Vietjet/sqlite/queries.sql) | **Các câu truy vấn mẫu**: Truy vấn 8 tour trang chủ, lọc chuyến bay theo sân bay & giá, tra cứu chi tiết hành trình, lịch sử đơn đặt chỗ. |

---

## 🛠️ HƯỚNG DẪN SỬ DỤNG VỚI CÁC CÔNG CỤ SQLITE

### 1. Sử dụng bằng SQLite CLI (Dòng lệnh Terminal)
Nếu bạn có cài đặt `sqlite3` trên máy tính:
```bash
# Di chuyển vào thư mục dự án
cd d:\Toan\Vietjet

# Tạo file database vietjet.db và chạy script khởi tạo:
sqlite3 vietjet.db < sqlite/init.sql
```

### 2. Sử dụng DB Browser for SQLite (Phần mềm giao diện miễn phí)
1. Mở **DB Browser for SQLite**.
2. Chọn **New Database** -> Lưu tên file là `vietjet.db`.
3. Chuyển sang tab **Execute SQL** (Thực thi SQL).
4. Mở file [`sqlite/init.sql`](file:///d:/Toan/Vietjet/sqlite/init.sql) hoặc copy nội dung dán vào và nhấn nút **Execute (F5)**.
5. Nhấn **Write Changes** để lưu lại database.

### 3. Sử dụng DBeaver / VS Code SQLite Extension
1. Mở extension **SQLite Viewer** hoặc **DBeaver**.
2. Chọn kết nối SQLite mới.
3. Chọn file [`sqlite/init.sql`](file:///d:/Toan/Vietjet/sqlite/init.sql) và chạy script.

---

## 💡 CÁCH WEB APP TỰ ĐỘNG SỬ DỤNG
Toàn bộ cấu trúc SQL trong các file này đã được nhúng trực tiếp vào file [`js/db.js`](file:///d:/Toan/Vietjet/js/db.js). Khi bạn mở [`index.html`](file:///d:/Toan/Vietjet/index.html), trình duyệt tự động nạp thư viện `sql.js` (WebAssembly SQLite) và tự động tạo/khôi phục CSDL này vào `localStorage` mà bạn không cần phải tự cài thêm phần mềm nào!
