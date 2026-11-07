-- ============================================================================
-- CÁC CÂU LỆNH TRUY VẤN MẪU (SQLITE QUERIES FOR VIETJET)
-- Tệp tin: sqlite/queries.sql
-- Mục đích: Tổng hợp các câu lệnh SELECT/INSERT thường dùng trong hệ thống
-- ============================================================================

-- 1. LẤY 8 TOUR NỔI BẬT CHO TRANG CHỦ
SELECT 
    t.id,
    t.title,
    t.tour_code,
    t.days_nights,
    t.price,
    t.thumbnail_url,
    t.origin_city,
    t.destination_city,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_id = a.id
WHERE t.is_featured = 1
ORDER BY t.id ASC
LIMIT 8;

-- 2. TÌM CHUYẾN BAY (Ví dụ: Từ TP.HCM [SGN] đi Hà Nội [HAN] sắp xếp giá tăng dần)
SELECT 
    f.id,
    f.flight_number,
    f.origin_code,
    f.origin_city,
    f.destination_code,
    f.destination_city,
    f.departure_time,
    f.arrival_time,
    f.duration,
    f.aircraft_type,
    f.price_economy,
    f.price_business,
    f.services,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM flights f
JOIN airlines a ON f.airline_id = a.id
WHERE f.origin_code = 'SGN' AND f.destination_code = 'HAN'
ORDER BY f.price_economy ASC;

-- 3. XEM CHI TIẾT 1 CHUYẾN BAY THEO ID (Kèm thông tin hãng bay)
SELECT 
    f.*,
    a.name AS airline_name,
    a.code AS airline_code,
    a.logo_url AS airline_logo,
    a.description AS airline_desc
FROM flights f
JOIN airlines a ON f.airline_id = a.id
WHERE f.id = 1;

-- 4. XEM CHI TIẾT 1 TOUR DU LỊCH & LỊCH TRÌNH JSON
SELECT 
    t.*,
    a.name AS airline_name,
    a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_id = a.id
WHERE t.id = 1;

-- 5. LỌC TOUR THEO THỜI LƯỢNG (Ví dụ: Tour ngắn ngày <= 3 ngày)
SELECT 
    t.id,
    t.title,
    t.days_nights,
    t.price,
    t.origin_city,
    t.destination_city,
    a.name AS airline_name
FROM tours t
JOIN airlines a ON t.airline_id = a.id
WHERE t.duration_days <= 3
ORDER BY t.price ASC;

-- 6. XEM TẤT CẢ ĐƠN ĐẶT CHỖ (BOOKINGS) ĐÃ THÀNH CÔNG
SELECT 
    id,
    booking_code,
    customer_name,
    customer_email,
    customer_phone,
    total_amount,
    email_status,
    created_at
FROM bookings
ORDER BY id DESC;

-- 7. THỐNG KÊ DOANH THU ĐẶT VÉ THEO HÃNG HÀNG KHÔNG
SELECT 
    a.name AS airline_name,
    COUNT(f.id) AS total_flights_operated,
    AVG(f.price_economy) AS avg_economy_price,
    AVG(f.price_business) AS avg_business_price
FROM airlines a
LEFT JOIN flights f ON a.id = f.airline_id
GROUP BY a.id;
