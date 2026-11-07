-- ============================================================================
-- TOÀN BỘ SCRIPT KHỞI TẠO CSDL SQLITE VIETJET (ALL-IN-ONE INIT SCRIPT)
-- Tệp tin: sqlite/init.sql
-- Cách dùng với SQLite CLI:
--   sqlite3 vietjet.db < sqlite/init.sql
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. TẠO CẤU TRÚC BẢNG (SCHEMA)
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airlines;

CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    logo_url TEXT NOT NULL,
    description TEXT
);

CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    origin_city TEXT NOT NULL,
    origin_code TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_code TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    flight_type TEXT NOT NULL DEFAULT 'direct',
    aircraft_type TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    price_economy INTEGER NOT NULL,
    price_business INTEGER NOT NULL,
    services TEXT NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tour_code TEXT NOT NULL UNIQUE,
    airline_id INTEGER NOT NULL,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    days_nights TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    departure_date TEXT NOT NULL,
    flight_time TEXT NOT NULL,
    aircraft_type TEXT NOT NULL,
    price INTEGER NOT NULL,
    thumbnail_url TEXT NOT NULL,
    services TEXT NOT NULL,
    itinerary_json TEXT NOT NULL,
    is_featured INTEGER DEFAULT 0,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    unit_price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    flight_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_notes TEXT,
    total_amount INTEGER NOT NULL,
    items_summary TEXT NOT NULL,
    email_status TEXT DEFAULT 'SENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Indexes
CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin_code, destination_code);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_id);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);

-- ----------------------------------------------------------------------------
-- 2. NẠP DỮ LIỆU MẪU (SEED DATA)
-- ----------------------------------------------------------------------------

-- Hãng Hàng Không
INSERT INTO airlines (id, name, code, logo_url, description) VALUES
(1, 'VietJet Air', 'VJ', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không thế hệ mới, bay khắp năm châu với chi phí tiết kiệm'),
(2, 'Vietnam Airlines', 'VN', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không quốc gia chuẩn 4 sao quốc tế, dịch vụ chu đáo'),
(3, 'Singapore Airlines', 'SQ', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=60', 'Hãng hàng không hàng đầu thế giới với phi đội máy bay siêu hiện đại'),
(4, 'Bamboo Airways', 'QH', 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=120&auto=format&fit=crop&q=60', 'Hơn cả một chuyến bay, mang đến sự hiếu khách và đúng giờ tuyệt đối');

-- 8 Tour Du Lịch Nổi Bật (Thumbnail 600x400)
INSERT INTO tours (id, title, tour_code, airline_id, origin_city, destination_city, days_nights, duration_days, departure_date, flight_time, aircraft_type, price, thumbnail_url, services, itinerary_json, is_featured) VALUES
(1, 'Tour Khám Phá Đảo Ngọc Phú Quốc - Sunset Town & Cáp Treo Hòn Thơm', 'TOUR-PQC-01', 1, 'Hồ Chí Minh', 'Phú Quốc', '3N2Đ', 3, '2026-11-20', '07:30', 'Airbus A321neo', 3890000, 
'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=400&fit=crop', 
'Vé máy bay khứ hồi Vietjet, Khách sạn 4 sao, Buffet sáng, Vé cáp treo Hòn Thơm, Xe đưa đón VIP',
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

-- Các Chuyến Bay Mẫu
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
