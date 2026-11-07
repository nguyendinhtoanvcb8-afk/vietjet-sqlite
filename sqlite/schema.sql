-- ============================================================================
-- CSDL DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET (SQLITE DATABASE SCHEMA)
-- Tệp tin: sqlite/schema.sql
-- Mục đích: Định nghĩa cấu trúc bảng (DDL), khóa ngoại và các chỉ mục (Indexes)
-- ============================================================================

-- Bật hỗ trợ ràng buộc khóa ngoại trong SQLite
PRAGMA foreign_keys = ON;

-- 1. BẢNG HÃNG HÀNG KHÔNG (airlines)
DROP TABLE IF EXISTS airlines;
CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                                     -- Tên hãng: VietJet Air, Vietnam Airlines...
    code TEXT NOT NULL UNIQUE,                              -- Mã IATA: VJ, VN, SQ, QH...
    logo_url TEXT NOT NULL,                                 -- Đường dẫn ảnh logo hãng
    description TEXT                                        -- Giới thiệu ngắn về hãng
);

-- 2. BẢNG CHUYẾN BAY (flights)
DROP TABLE IF EXISTS flights;
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,                            -- Mã hiệu chuyến bay: VJ-128, VN-210...
    airline_id INTEGER NOT NULL,                            -- Khóa ngoại liên kết bảng airlines
    origin_city TEXT NOT NULL,                              -- Tên thành phố đi: Hồ Chí Minh, Hà Nội...
    origin_code TEXT NOT NULL,                              -- Mã sân bay đi: SGN, HAN, DAD, PQC, CXR, SIN, BKK
    destination_city TEXT NOT NULL,                         -- Tên thành phố đến
    destination_code TEXT NOT NULL,                         -- Mã sân bay đến
    departure_time TEXT NOT NULL,                           -- Giờ cất cánh (Định dạng HH:MM, ví dụ: 06:15)
    arrival_time TEXT NOT NULL,                             -- Giờ hạ cánh (Định dạng HH:MM, ví dụ: 08:25)
    duration TEXT NOT NULL,                                 -- Tổng thời gian bay (ví dụ: 2h 10m)
    flight_type TEXT NOT NULL DEFAULT 'direct',             -- 'direct' (Bay thẳng) hoặc 'connecting' (Nhiều chặng)
    aircraft_type TEXT NOT NULL,                            -- Dòng tàu bay: Airbus A321neo, Boeing 787-9...
    departure_date TEXT NOT NULL,                           -- Ngày cất cánh (YYYY-MM-DD)
    price_economy INTEGER NOT NULL,                         -- Giá vé Hạng Phổ Thông (VNĐ)
    price_business INTEGER NOT NULL,                        -- Giá vé Hạng Thương Gia (VNĐ)
    services TEXT NOT NULL,                                 -- Dịch vụ tiện ích đi kèm
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

-- 3. BẢNG TOUR DU LỊCH (tours)
DROP TABLE IF EXISTS tours;
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                                    -- Tên tour du lịch
    tour_code TEXT NOT NULL UNIQUE,                         -- Mã tour: TOUR-PQC-01, TOUR-DAD-02...
    airline_id INTEGER NOT NULL,                            -- Hãng hàng không bay kèm
    origin_city TEXT NOT NULL,                              -- Thành phố xuất phát
    destination_city TEXT NOT NULL,                         -- Thành phố điểm đến
    days_nights TEXT NOT NULL,                              -- Thời lượng: 3N2Đ, 4N3Đ, 5N4Đ...
    duration_days INTEGER NOT NULL,                         -- Số ngày đi (để lọc ngắn/dài ngày)
    departure_date TEXT NOT NULL,                           -- Ngày khởi hành (YYYY-MM-DD)
    flight_time TEXT NOT NULL,                              -- Giờ bay dự kiến
    aircraft_type TEXT NOT NULL,                            -- Loại tàu bay vận chuyển
    price INTEGER NOT NULL,                                 -- Giá tour trọn gói (VNĐ)
    thumbnail_url TEXT NOT NULL,                            -- Ảnh chuẩn tỷ lệ 600x400 px
    services TEXT NOT NULL,                                 -- Danh sách dịch vụ bao gồm
    itinerary_json TEXT NOT NULL,                           -- Chuỗi JSON chi tiết lịch trình theo từng ngày
    is_featured INTEGER DEFAULT 0,                          -- 1: Tour nổi bật trang chủ, 0: Tour thường
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

-- 4. BẢNG GIỎ HÀNG (cart_items)
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,                                -- 'flight' (Chuyến bay) hoặc 'tour' (Tour)
    item_id INTEGER NOT NULL,                               -- ID của chuyến bay hoặc tour
    title TEXT NOT NULL,                                    -- Tiêu đề hiển thị
    subtitle TEXT,                                          -- Hạng vé, giờ bay hoặc ngày khởi hành
    unit_price INTEGER NOT NULL,                            -- Đơn giá (VNĐ)
    quantity INTEGER DEFAULT 1,                             -- Số lượng hành khách / số vé
    flight_date TEXT,                                       -- Ngày bay
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- Thời điểm thêm vào giỏ
);

-- 5. BẢNG ĐƠN ĐẶT CHỖ (bookings)
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,                      -- Mã đặt chỗ duy nhất: VJ-BOOK-84912...
    customer_name TEXT NOT NULL,                            -- Họ và tên khách hàng
    customer_email TEXT NOT NULL,                           -- Email khách hàng nhận thông báo
    customer_phone TEXT NOT NULL,                           -- Số điện thoại liên hệ
    customer_notes TEXT,                                    -- Yêu cầu đặc biệt
    total_amount INTEGER NOT NULL,                          -- Tổng tiền thanh toán đã gồm thuế VAT 8%
    items_summary TEXT NOT NULL,                            -- Tóm tắt danh sách vé / tour đã đặt
    email_status TEXT DEFAULT 'SENT',                       -- Trạng thái email gửi từ nvhai061993@gmail.com
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- Thời điểm đặt chỗ thành công
);

-- ============================================================================
-- CÁC CHỈ MỤC (INDEXES) TỐI ƯU TỐC ĐỘ TRUY VẤN
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin_code, destination_code);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_price_eco ON flights(price_economy);
CREATE INDEX IF NOT EXISTS idx_flights_price_bus ON flights(price_business);

CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_id);
CREATE INDEX IF NOT EXISTS idx_tours_price ON tours(price);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
