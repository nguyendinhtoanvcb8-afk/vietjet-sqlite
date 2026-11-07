# KIẾN TRÚC CƠ SỞ DỮ LIỆU SQLITE & SEED DATA (DATABASE SCHEMA)

Tài liệu này cung cấp toàn bộ định nghĩa bảng SQL, dữ liệu mẫu (Seed Data) và phương thức tích hợp SQLite WebAssembly (`sql.js`) cho website **Vietjet**.

---

## 1. PHƯƠNG THỨC HOẠT ĐỘNG CỦA SQLITE PHÍA CLIENT
Vì dự án chạy **HTML, CSS, JavaScript thuần không có Backend**, CSDL SQLite được vận hành bằng WebAssembly (`sql.js`):
1. **Khởi tạo:** Tải thư viện `sql.js` từ CDN.
2. **Nạp dữ liệu:**
   - Nếu `localStorage.getItem('vietjet_sqlite_db')` đã tồn tại -> Khôi phục cơ sở dữ liệu từ bộ nhớ.
   - Nếu chưa có -> Tạo mới database, chạy toàn bộ câu lệnh DDL (Create Table) và nạp Dữ liệu mẫu (Seed Data) bên dưới, sau đó lưu trạng thái vào `localStorage`.
3. **Thao tác:** Sử dụng cú pháp SQL chuẩn (`db.exec()`, `db.prepare()`) để truy vấn và cập nhật.

---

## 2. CẤU TRÚC BẢNG (DATABASE SCHEMA)

```sql
-- 1. Bảng Hãng Hàng Không
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    logo_url TEXT NOT NULL,
    description TEXT
);

-- 2. Bảng Chuyến Bay
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    origin_city TEXT NOT NULL,
    origin_code TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_code TEXT NOT NULL,
    departure_time TEXT NOT NULL,      -- Định dạng "HH:MM", ví dụ "06:15"
    arrival_time TEXT NOT NULL,        -- Định dạng "HH:MM", ví dụ "08:25"
    duration TEXT NOT NULL,            -- Ví dụ: "2h 10m"
    flight_type TEXT NOT NULL,         -- 'direct' (Bay thẳng), 'connecting' (Nhiều chặng)
    aircraft_type TEXT NOT NULL,       -- Ví dụ: "Airbus A321neo", "Boeing 787-9"
    departure_date TEXT NOT NULL,      -- Định dạng "YYYY-MM-DD"
    price_economy INTEGER NOT NULL,    -- Giá hạng phổ thông (VNĐ)
    price_business INTEGER NOT NULL,   -- Giá hạng thương gia (VNĐ)
    services TEXT NOT NULL,            -- Danh sách dịch vụ dạng chuỗi ngăn cách dấu phẩy
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 3. Bảng Tour Du Lịch
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tour_code TEXT NOT NULL UNIQUE,
    airline_id INTEGER NOT NULL,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    days_nights TEXT NOT NULL,         -- Ví dụ: "4N3Đ", "3N2Đ"
    duration_days INTEGER NOT NULL,
    departure_date TEXT NOT NULL,
    flight_time TEXT NOT NULL,         -- Ví dụ: "07:30"
    aircraft_type TEXT NOT NULL,
    price INTEGER NOT NULL,            -- Giá tour trọn gói (VNĐ)
    thumbnail_url TEXT NOT NULL,       -- Ảnh chuẩn 600x400 px
    services TEXT NOT NULL,            -- Dịch vụ trọn gói
    itinerary_json TEXT NOT NULL,      -- JSON lịch trình chi tiết từng ngày
    is_featured INTEGER DEFAULT 0,     -- 1 nếu là tour nổi bật trang chủ
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 4. Bảng Giỏ Hàng (Lưu trạng thái giỏ)
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,           -- 'flight' hoặc 'tour'
    item_id INTEGER NOT NULL,          -- ID chuyến bay hoặc tour
    title TEXT NOT NULL,
    subtitle TEXT,                     -- Ví dụ: "Hạng Phổ Thông" hoặc "Khởi hành: 15/11"
    unit_price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    flight_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Đơn Đặt Chỗ (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_notes TEXT,
    total_amount INTEGER NOT NULL,
    items_summary TEXT NOT NULL,       -- Chuỗi mô tả hoặc JSON các mặt hàng đã đặt
    email_status TEXT DEFAULT 'SENT',  -- 'SENT' từ nvhai061993@gmail
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. DỮ LIỆU MẪU (SEED DATA SQL)

```sql
-- Nạp danh sách Hãng hàng không
INSERT INTO airlines (id, name, code, logo_url, description) VALUES
(1, 'VietJet Air', 'VJ', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không thế hệ mới, bay khắp năm châu'),
(2, 'Vietnam Airlines', 'VN', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không quốc gia chuẩn 4 sao quốc tế'),
(3, 'Singapore Airlines', 'SQ', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không hàng đầu thế giới với dịch vụ đẳng cấp'),
(4, 'Bamboo Airways', 'QH', 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=120&auto=format&fit=crop&q=60', 'Hơn cả một chuyến bay, trải nghiệm mến khách');

-- Nạp 8 Tour du lịch nổi bật (Ảnh 600x400)
INSERT INTO tours (id, title, tour_code, airline_id, origin_city, destination_city, days_nights, duration_days, departure_date, flight_time, aircraft_type, price, thumbnail_url, services, itinerary_json, is_featured) VALUES
(1, 'Tour Khám Phá Đảo Ngọc Phú Quốc - Sunset Town & Cáp Treo Hòn Thơm', 'TOUR-PQC-01', 1, 'Hồ Chí Minh', 'Phú Quốc', '3N2Đ', 3, '2026-11-20', '07:30', 'Airbus A321neo', 3890000, 
'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=400&fit=crop', 
'Vé máy bay khứ hồi, Khách sạn 4 sao, Buffet sáng, Vé cáp treo Hòn Thơm, Xe đưa đón VIP',
'[{"day": 1, "title": "Khởi hành đến Phú Quốc - Check-in Sunset Town", "detail": "Bay từ Tân Sơn Nhất đến Phú Quốc. Xe đón về resort 4 sao. Chiều tham quan Cầu Hôn (Kiss Bridge) ngắm hoàng hôn rực rỡ."}, {"day": 2, "title": "Khám phá Nam Đảo & Cáp Treo Vượt Biển", "detail": "Trải nghiệm cáp treo Hòn Thơm dài nhất thế giới, vui chơi tại công viên nước Aquatopia, lặn ngắm san hô tại hòn Móng Tay."}, {"day": 3, "title": "Chợ đêm Phú Quốc - Mua sắm đặc sản - Bay về", "detail": "Thưởng thức bún quậy Kiến Xây, mua tiêu, ngọc trai và nước mắm truyền thống. Ra sân bay về lại TP.HCM."}]', 1),

(2, 'Tour Đà Nẵng - Phố Cổ Hội An - Bà Nà Hills Cầu Vàng', 'TOUR-DAD-02', 1, 'Hồ Chí Minh', 'Đà Nẵng', '4N3Đ', 4, '2026-11-25', '06:45', 'Airbus A321neo', 4690000, 
'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', 
'Vé máy bay Vietjet, Khách sạn 4 sao biển Mỹ Khê, Vé cáp treo Bà Nà, 06 bữa chính đặc sản',
'[{"day": 1, "title": "TP.HCM - Đà Nẵng - Tắm biển Mỹ Khê", "detail": "Đến Đà Nẵng, xe đưa về khách sạn nghỉ ngơi, tự do tắm biển Mỹ Khê xinh đẹp."}, {"day": 2, "title": "Đỉnh Bà Nà Hills - Cầu Vàng Bàn Tay Khổng Lồ", "detail": "Chinh phục đỉnh Bà Nà, dạo bước trên Cầu Vàng nổi tiếng toàn cầu, tham quan Làng Pháp."}, {"day": 3, "title": "Rừng dừa Bảy Mẫu - Phố cổ Hội An lung linh đèn lồng", "detail": "Trải nghiệm chèo thuyền thúng, dạo phố cổ Hội An thưởng thức cao lầu, cơm gà."}, {"day": 4, "title": "Bán đảo Sơn Trà - Chùa Linh Ứng - Tạm biệt Đà Nẵng", "detail": "Viếng chùa Linh Ứng, mua sắm chợ Hàn và bay về TP.HCM."}]', 1),

(3, 'Tour Kỳ Quan Hạ Long - Vịnh Lan Hạ - Du Thuyền 5 Sao', 'TOUR-HL-03', 2, 'Hồ Chí Minh', 'Hà Nội - Hạ Long', '3N2Đ', 3, '2026-12-01', '08:15', 'Boeing 787-9', 5990000, 
'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop', 
'Vé Vietnam Airlines khứ hồi, Du thuyền ngủ đêm 5 sao, Chèo thuyền Kayak, Tiệc hải sản hoàng hôn',
'[{"day": 1, "title": "TP.HCM - Hà Nội - Di chuyển tới Vịnh Hạ Long", "detail": "Bay ra Nội Bài, xe limousine đón đến bến Tuần Châu nhận phòng du thuyền 5 sao."}, {"day": 2, "title": "Thăm Hang Sửng Sốt - Đảo Ti Tốp - Chèo Kayak Vịnh Lan Hạ", "detail": "Khám phá vẻ đẹp kỳ ảo của hang động đá vôi, tắm biển Ti Tốp và tiệc trà chiều hoàng hôn."}, {"day": 3, "title": "Tập Thái Cực Quyền đón bình minh - Về Hà Nội - Bay về", "detail": "Đón bình minh trên boong tàu, xe đưa về Hà Nội thưởng thức phở Bát Đàn trước khi bay về."}]', 1),

(4, 'Tour Đà Lạt Xứ Sở Sương Mù - Săn Mây Cầu Đất - Đồi Chè', 'TOUR-DLI-04', 1, 'Hà Nội', 'Đà Lạt', '3N2Đ', 3, '2026-11-28', '09:00', 'Airbus A321neo', 3490000, 
'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop', 
'Vé máy bay Vietjet, Khách sạn 3 sao trung tâm gần Hồ Xuân Hương, Xe du lịch máy lạnh, Lẩu gà lá é',
'[{"day": 1, "title": "Hà Nội - Đà Lạt - Thác Datanla - Dinh Bảo Đại", "detail": "Hạ cánh sân bay Liên Khương, trải nghiệm máng trượt Datanla kỳ thú."}, {"day": 2, "title": "Săn Mây Cầu Đất lúc bình minh - Vườn hoa Cẩm Tú Cầu", "detail": "Khởi hành sớm săn mây đón những tia nắng đầu ngày tuyệt mỹ tại Đồi Chè Cầu Đất."}, {"day": 3, "title": "Chợ Đà Lạt mua dâu tây - Quảng trường Lâm Viên - Bay về", "detail": "Thưởng thức sữa đậu nành nóng, mua mứt Atiso và khởi hành ra sân bay."}]', 1),

(5, 'Tour Singapore Hiện Đại - Marina Bay Sands - Jewel Changi', 'TOUR-SIN-05', 3, 'Hồ Chí Minh', 'Singapore', '4N3Đ', 4, '2026-12-10', '09:10', 'Airbus A350-900', 8990000, 
'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 
'Vé Singapore Airlines đẳng cấp, Khách sạn 4 sao Orchard, Vé Gardens by the Bay, Bảo hiểm du lịch 1 tỷ',
'[{"day": 1, "title": "TP.HCM - Singapore - Check-in Thác nước Jewel Changi", "detail": "Chiêm ngưỡng thác nước trong nhà cao nhất thế giới tại sân bay Changi số 1 thế giới."}, {"day": 2, "title": "Gardens by the Bay - Công viên Sư Tử Biển Merlion Park", "detail": "Khám phá siêu cây Supertree Grove, nhà kính Flower Dome và vịnh Marina Bay rực rỡ ánh đèn."}, {"day": 3, "title": "Đảo Sentosa - Universal Studios - Nhạc nước Wings of Time", "detail": "Vui chơi thỏa thích tại Universal Studios và thưởng thức đại tiệc âm thanh ánh sáng ngoài biển."}, {"day": 4, "title": "Mua sắm tại Đại lộ Orchard - Bay về TP.HCM", "detail": "Thỏa sức mua sắm hàng miễn thuế và kết thúc chuyến đi tuyệt vời."}]', 1),

(6, 'Tour Bangkok - Pattaya Thái Lan - Đảo San Hô Coral', 'TOUR-BKK-06', 1, 'Hồ Chí Minh', 'Bangkok - Pattaya', '5N4Đ', 5, '2026-11-22', '10:30', 'Airbus A321neo', 6290000, 
'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', 
'Vé máy bay Vietjet gồm 20kg ký gửi, Khách sạn 4 sao chuẩn Thái, Massage Thái cổ truyền, Buffet Baiyoke Sky 86 tầng',
'[{"day": 1, "title": "TP.HCM - Bangkok - Thành phố biển Pattaya", "detail": "Bay Vietjet đến Suvarnabhumi, viếng Chợ nổi 4 miền đậm nét văn hóa Thái."}, {"day": 2, "title": "Đảo Coral nước trong vắt - Trân Bảo Phật Sơn Khổng Lồ", "detail": "Đi cano cao tốc ra đảo Coral tắm biển, chiêm bái tượng Phật khắc laser trên vách núi đá."}, {"day": 3, "title": "Thành phố Cổ Muang Boran - Bangkok hoa lệ", "detail": "Khám phá công viên di sản thu nhỏ Muang Boran, thưởng thức Alcazar Show đặc sắc."}, {"day": 4, "title": "Chùa Thuyền Wat Yannawa - Dạo thuyền sông Chao Phraya", "detail": "Cầu bình an tại chùa Thuyền, xem hiện tượng cá nổi trên dòng sông mẹ Chao Phraya."}, {"day": 5, "title": "Mua sắm IconSiam - Bay về Tân Sơn Nhất", "detail": "Check-in trung tâm thương mại xa hoa IconSiam và bay về TP.HCM."}]', 1),

(7, 'Tour Khám Phá Nha Trang Biển Xanh - VinWonders & Du Thuyền', 'TOUR-NHA-07', 4, 'Hà Nội', 'Nha Trang', '4N3Đ', 4, '2026-12-05', '07:15', 'Airbus A320', 4390000, 
'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop', 
'Vé Bamboo Airways, Resort 5 sao mặt biển, Vé trọn gói VinWonders đảo Hòn Tre, Tắm bùn khoáng nóng',
'[{"day": 1, "title": "Hà Nội - Cam Ranh - Nha Trang - Tắm bùn Tháp Bà", "detail": "Đến vịnh Nha Trang xinh đẹp, ngâm mình trong bùn khoáng thư giãn phục hồi sức khỏe."}, {"day": 2, "title": "Thiên đường giải trí VinWonders Hòn Tre", "detail": "Thử thách các trò chơi cảm giác mạnh, ngắm vịnh biển từ vòng quay khổng lồ Sky Wheel."}, {"day": 3, "title": "Du ngoạn 4 Đảo - Hòn Mun lặn ngắm rạn san hô", "detail": "Tàu gỗ đưa đi vịnh san hô Hòn Mun, tiệc bar nổi trên biển vui nhộn."}, {"day": 4, "title": "Chùa Long Sơn - Tháp Bà Ponagar - Về lại Hà Nội", "detail": "Chiêm ngưỡng kiến trúc Chăm Pa cổ kính và khởi hành về Hà Nội."}]', 1),

(8, 'Tour Hà Giang Hùng Vĩ - Mùa Hoa Tam Giác Mạch - Đèo Mã Pí Lèng', 'TOUR-HG-08', 2, 'Hồ Chí Minh', 'Hà Nội - Hà Giang', '4N3Đ', 4, '2026-11-29', '06:00', 'Airbus A350-900', 5490000, 
'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop', 
'Vé Vietnam Airlines, Xe limousine đời mới, Homestay Papiu cao cấp, Thuyền hẻm Tu Sản',
'[{"day": 1, "title": "TP.HCM - Hà Nội - Cột Mốc Km0 Hà Giang - Quản Bạ", "detail": "Bay sáng ra Nội Bài, xe đón thẳng lên cao nguyên đá ngắm Núi Đôi Cô Tiên."}, {"day": 2, "title": "Dinh Vua Mèo - Cột cờ Lũng Cú Nơi Cực Bắc Tổ Quốc", "detail": "Chạm tay vào lá cờ thiêng 54m2 trên đỉnh núi Rồng, ngắm thung lũng tam giác mạch bạt ngàn."}, {"day": 3, "title": "Chinh phục Tứ Đại Đỉnh Đèo Mã Pí Lèng - Du thuyền Sông Nho Quế", "detail": "Đi thuyền trên làn nước xanh ngọc bích hẻm vực Tu Sản kỳ vĩ nhất Đông Nam Á."}, {"day": 4, "title": "Làng văn hóa Lũng Cẩm - Hà Nội - Bay về TP.HCM", "detail": "Ghé thăm nhà của Pao, trở về Nội Bài đáp chuyến bay tối về lại TP.HCM."}]', 1);

-- Nạp danh sách các chuyến bay mẫu
INSERT INTO flights (id, flight_number, airline_id, origin_city, origin_code, destination_city, destination_code, departure_time, arrival_time, duration, flight_type, aircraft_type, departure_date, price_economy, price_business, services) VALUES
(1, 'VJ-128', 1, 'Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '06:15', '08:25', '2h 10m', 'direct', 'Airbus A321neo', '2026-11-15', 1290000, 3190000, 'Hành lý xách tay 7kg, Nước suối, Đổi vé có phí'),
(2, 'VN-210', 2, 'Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '07:00', '09:10', '2h 10m', 'direct', 'Boeing 787-9', '2026-11-15', 1890000, 4850000, 'Hành lý 12kg xách tay + 23kg ký gửi, Suất ăn nóng, Ghế da cao cấp'),
(3, 'VJ-140', 1, 'Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '11:45', '13:55', '2h 10m', 'direct', 'Airbus A320', '2026-11-15', 990000, 2890000, 'Hành lý xách tay 7kg, Giá tiết kiệm mùa lễ hội'),
(4, 'QH-224', 4, 'Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '14:30', '16:40', '2h 10m', 'direct', 'Boeing 787-9', '2026-11-15', 1450000, 3650000, 'Hành lý 7kg xách tay + 20kg ký gửi, Suất ăn nhẹ tươi ngon'),
(5, 'VJ-162', 1, 'Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '18:50', '21:00', '2h 10m', 'direct', 'Airbus A321neo', '2026-11-15', 1150000, 2990000, 'Hành lý xách tay 7kg, Bay giờ vàng tối'),
(6, 'VJ-322', 1, 'Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '08:20', '09:40', '1h 20m', 'direct', 'Airbus A321neo', '2026-11-16', 790000, 2190000, 'Hành lý xách tay 7kg, Bay thẳng nhanh chóng'),
(7, 'VN-118', 2, 'Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '10:00', '11:20', '1h 20m', 'direct', 'Airbus A350-900', '2026-11-16', 1350000, 3200000, 'Hành lý ký gửi 23kg, Suất ăn nhẹ, Phòng chờ Bông Sen'),
(8, 'VJ-380', 1, 'Hồ Chí Minh', 'SGN', 'Phú Quốc', 'PQC', '07:10', '08:15', '1h 05m', 'direct', 'Airbus A321neo', '2026-11-17', 680000, 1990000, 'Hành lý xách tay 7kg, Vé khuyến mãi biển hè'),
(9, 'SQ-178', 3, 'Hồ Chí Minh', 'SGN', 'Singapore', 'SIN', '12:15', '15:20', '2h 05m', 'direct', 'Boeing 787-10', '2026-11-18', 3450000, 8900000, 'Hành lý 30kg ký gửi, Ẩm thực chuẩn 5 sao, Rạp chiếu phim tại ghế'),
(10, 'VJ-811', 1, 'Hồ Chí Minh', 'SGN', 'Singapore', 'SIN', '09:00', '12:05', '2h 05m', 'direct', 'Airbus A321neo', '2026-11-18', 1590000, 4200000, 'Hành lý xách tay 7kg, Bay thẳng Changi T4'),
(11, 'VN-601', 2, 'Hồ Chí Minh', 'SGN', 'Bangkok', 'BKK', '08:45', '10:15', '1h 30m', 'direct', 'Airbus A321', '2026-11-19', 2150000, 5400000, 'Hành lý ký gửi 23kg, Suất ăn nóng, Dịch vụ chu đáo'),
(12, 'VJ-803', 1, 'Hồ Chí Minh', 'SGN', 'Bangkok', 'BKK', '11:15', '12:45', '1h 30m', 'direct', 'Airbus A321neo', '2026-11-19', 1190000, 3100000, 'Hành lý xách tay 7kg, Đến sân bay Suvarnabhumi');
```

---

## 4. TÍCH HỢP JAVASCRIPT CLIENT (MẪU CODE `js/db.js`)

```javascript
// js/db.js
class VietjetDB {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.storageKey = 'vietjet_sqlite_db_v1';
  }

  async init() {
    if (this.db) return this.db;
    
    // Nạp thư viện sql.js WebAssembly từ CDN
    this.SQL = await window.initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      // Khôi phục từ localStorage (dạng binary Base64 hoặc Byte Array)
      const binary = Uint8Array.from(atob(savedData), c => c.charCodeAt(0));
      this.db = new this.SQL.Database(binary);
      console.log('Vietjet SQLite DB khôi phục từ localStorage.');
    } else {
      // Khởi tạo mới và nạp Seed Schema
      this.db = new this.SQL.Database();
      await this.seed();
      this.save();
      console.log('Vietjet SQLite DB tạo mới và nạp dữ liệu mẫu thành công.');
    }
    return this.db;
  }

  save() {
    if (!this.db) return;
    const binary = this.db.export();
    let binaryString = '';
    const bytes = new Uint8Array(binary);
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    localStorage.setItem(this.storageKey, btoa(binaryString));
  }

  query(sql, params = []) {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  run(sql, params = []) {
    this.db.run(sql, params);
    this.save();
  }
}

window.vietjetDB = new VietjetDB();
```
