/**
 * ============================================================================
 * VIETJET FLIGHTS LOGIC (js/flights.js)
 * Real-time SQLite Querying, Filtering & Dynamic Rendering
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.vietjetDB.init();
    initFlightsPage();
  } catch (err) {
    console.error('Lỗi nạp database chuyến bay:', err);
  }
});

let currentFilters = {
  origin: '',
  destination: '',
  date: '',
  tripType: 'all',      // 'all', 'roundtrip', 'oneway', 'direct', 'multi'
  airlineIds: [],       // [1, 2, 3, 4]
  timeRange: '',        // 'early', 'morning', 'afternoon', 'night'
  serviceClass: 'economy', // 'economy' hoặc 'business'
  sortBy: 'default'     // 'default', 'price_asc', 'price_desc'
};

function initFlightsPage() {
  // 1. Đọc các tham số từ URL
  const params = window.getQueryParams();
  if (params.origin) currentFilters.origin = params.origin;
  if (params.dest) currentFilters.destination = params.dest;
  if (params.date) currentFilters.date = params.date;
  if (params.type) currentFilters.tripType = params.type;

  // Lọc theo tên hãng nếu click từ Logo Hãng ở Trang Chủ
  if (params.airline) {
    const airlines = window.vietjetDB.getAirlines();
    const matched = airlines.find(a => a.name.toLowerCase().includes(params.airline.toLowerCase()));
    if (matched) {
      currentFilters.airlineIds = [matched.id];
      const cb = document.querySelector(`.filter-airline-cb[value="${matched.id}"]`);
      if (cb) cb.checked = true;
    }
  }

  // 2. Cập nhật thanh tiêu đề hành trình
  updateRouteHeader();

  // 3. Gắn sự kiện cho các bộ lọc bên trái
  bindFilterEvents();

  // 4. Thực thi truy vấn và hiển thị
  applyFiltersAndRender();
}

/**
 * Cập nhật thanh thông tin lộ trình trên cùng
 */
function updateRouteHeader() {
  const originEl = document.getElementById('header-origin');
  const destEl = document.getElementById('header-dest');
  const dateEl = document.getElementById('header-date');

  if (originEl) originEl.textContent = currentFilters.origin || 'Tất Cả';
  if (destEl) destEl.textContent = currentFilters.destination || 'Toàn Quốc';
  if (dateEl) dateEl.textContent = currentFilters.date ? window.formatDateVN(currentFilters.date) : 'Hôm nay';
}

/**
 * Gắn sự kiện thay đổi cho các input trong sidebar
 */
function bindFilterEvents() {
  // Sắp xếp giá
  const sortRadios = document.querySelectorAll('input[name="filter_sort"]');
  sortRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Loại vé / chuyến bay
  const typeRadios = document.querySelectorAll('input[name="filter_trip_type"]');
  typeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.tripType = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Hãng hàng không
  const airlineCheckboxes = document.querySelectorAll('.filter-airline-cb');
  airlineCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = [];
      airlineCheckboxes.forEach(item => {
        if (item.checked) selected.push(parseInt(item.value));
      });
      currentFilters.airlineIds = selected;
      applyFiltersAndRender();
    });
  });

  // Thời gian cất cánh
  const timeRadios = document.querySelectorAll('input[name="filter_time"]');
  timeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.timeRange = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Hạng dịch vụ
  const classRadios = document.querySelectorAll('input[name="filter_class"]');
  classRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.serviceClass = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Nút đặt lại bộ lọc
  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }
}

/**
 * Đặt lại toàn bộ bộ lọc về mặc định
 */
function resetAllFilters() {
  currentFilters = {
    origin: '',
    destination: '',
    date: '',
    tripType: 'all',
    airlineIds: [],
    timeRange: '',
    serviceClass: 'economy',
    sortBy: 'default'
  };

  // Reset controls
  const form = document.getElementById('flights-filter-form');
  if (form) form.reset();

  updateRouteHeader();
  applyFiltersAndRender();
}

/**
 * Truy vấn SQLite và render danh sách chuyến bay
 */
function applyFiltersAndRender() {
  const container = document.getElementById('flights-list-container');
  const countEl = document.getElementById('flights-count');
  if (!container) return;

  // Lấy dữ liệu từ SQLite
  const flights = window.vietjetDB.queryFlights({
    origin: currentFilters.origin,
    destination: currentFilters.destination,
    airlineIds: currentFilters.airlineIds,
    flightType: currentFilters.tripType === 'direct' ? 'direct' : null,
    timeRange: currentFilters.timeRange,
    serviceClass: currentFilters.serviceClass,
    sortBy: currentFilters.sortBy
  });

  // Cập nhật số lượng
  if (countEl) countEl.textContent = flights.length;

  if (flights.length === 0) {
    container.innerHTML = `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:60px 20px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">🛫</div>
        <h3 style="font-size:1.3rem; margin-bottom:8px;">Không tìm thấy chuyến bay phù hợp</h3>
        <p style="color:#64748b; margin-bottom:20px;">Vui lòng điều chỉnh hoặc đặt lại các tiêu chí bộ lọc để xem nhiều chuyến bay hơn.</p>
        <button class="btn btn-outline" onclick="resetAllFilters()">Đặt Lại Bộ Lọc</button>
      </div>
    `;
    return;
  }

  // Render các thẻ chuyến bay
  container.innerHTML = flights.map(flight => {
    const isBusiness = currentFilters.serviceClass === 'business';
    const price = isBusiness ? flight.price_business : flight.price_economy;
    const classLabel = isBusiness ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';

    return `
      <article class="flight-card">
        <!-- Cột 1: Thông tin Hãng & Máy bay -->
        <div class="flight-airline-col">
          <div class="airline-badge-row">
            <img src="${flight.airline_logo}" alt="${flight.airline_name}" class="airline-thumb">
            <div class="airline-meta">
              <h4>${flight.airline_name}</h4>
              <span class="flight-num">${flight.flight_number}</span>
            </div>
          </div>
          <div class="aircraft-name">✈ ${flight.aircraft_type}</div>
          <div class="flight-type-tag">Bay Thẳng</div>
        </div>

        <!-- Cột 2: Thời gian bay và Hành trình -->
        <div class="flight-journey-col">
          <div class="time-box">
            <div class="time-val">${flight.departure_time}</div>
            <div class="airport-code">${flight.origin_code}</div>
            <div class="city-name">${flight.origin_city}</div>
          </div>

          <div class="duration-box">
            <span class="duration-text">${flight.duration}</span>
            <div class="duration-line"></div>
            <span style="font-size: 0.72rem; color: #94a3b8;">Hành trình bay thẳng</span>
          </div>

          <div class="time-box">
            <div class="time-val">${flight.arrival_time}</div>
            <div class="airport-code">${flight.destination_code}</div>
            <div class="city-name">${flight.destination_city}</div>
          </div>
        </div>

        <!-- Cột 3: Giá & Nút Chọn -->
        <div class="flight-price-col">
          <span class="price-class-label">${classLabel}</span>
          <div class="flight-final-price">${window.formatVND(price)}</div>
          <div class="flight-services-summary">${flight.services}</div>
          <a href="flight-detail.html?flightId=${flight.id}&class=${currentFilters.serviceClass}" class="btn btn-primary btn-sm btn-block">
            Chọn Chuyến Bay
          </a>
        </div>
      </article>
    `;
  }).join('');
}
