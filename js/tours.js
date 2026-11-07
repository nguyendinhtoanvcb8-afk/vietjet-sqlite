/**
 * ============================================================================
 * VIETJET TOURS LOGIC (js/tours.js)
 * Filtering, SQLite Querying & Rendering Tour List
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.vietjetDB.init();
    initToursPage();
  } catch (err) {
    console.error('Lỗi nạp database tours:', err);
  }
});

let currentTourFilters = {
  airlineIds: [],
  duration: '',      // 'short' (<=3), 'medium' (4-5), 'long' (>5)
  sortBy: 'default'  // 'default', 'price_asc', 'price_desc'
};

function initToursPage() {
  bindTourFilterEvents();
  applyTourFilters();
}

function bindTourFilterEvents() {
  // Sắp xếp giá
  const sortRadios = document.querySelectorAll('input[name="tour_sort"]');
  sortRadios.forEach(r => {
    r.addEventListener('change', (e) => {
      currentTourFilters.sortBy = e.target.value;
      applyTourFilters();
    });
  });

  // Hãng hàng không
  const airlineCbs = document.querySelectorAll('.tour-airline-cb');
  airlineCbs.forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = [];
      airlineCbs.forEach(c => {
        if (c.checked) selected.push(parseInt(c.value));
      });
      currentTourFilters.airlineIds = selected;
      applyTourFilters();
    });
  });

  // Thời lượng tour
  const durationRadios = document.querySelectorAll('input[name="tour_duration"]');
  durationRadios.forEach(r => {
    r.addEventListener('change', (e) => {
      currentTourFilters.duration = e.target.value;
      applyTourFilters();
    });
  });

  // Reset
  const resetBtn = document.getElementById('btn-reset-tours');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTourFilters = { airlineIds: [], duration: '', sortBy: 'default' };
      const form = document.getElementById('tours-filter-form');
      if (form) form.reset();
      applyTourFilters();
    });
  }
}

function applyTourFilters() {
  const container = document.getElementById('tours-list-container');
  const countEl = document.getElementById('tours-count');
  if (!container) return;

  const tours = window.vietjetDB.queryTours({
    airlineIds: currentTourFilters.airlineIds,
    duration: currentTourFilters.duration,
    sortBy: currentTourFilters.sortBy
  });

  if (countEl) countEl.textContent = tours.length;

  if (tours.length === 0) {
    container.innerHTML = `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:60px 20px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">🏖️</div>
        <h3 style="font-size:1.3rem; margin-bottom:8px;">Không tìm thấy tour phù hợp</h3>
        <p style="color:#64748b; margin-bottom:20px;">Vui lòng thử bỏ bớt bộ lọc để khám phá các hành trình khác.</p>
        <button class="btn btn-outline" onclick="document.getElementById('btn-reset-tours').click()">Đặt Lại Bộ Lọc</button>
      </div>
    `;
    return;
  }

  container.innerHTML = tours.map(tour => `
    <article class="tour-list-card">
      <div class="tour-list-thumb-box">
        <img src="${tour.thumbnail_url}" alt="${tour.title}" class="tour-list-thumb" loading="lazy">
        <span class="tour-badge-duration" style="position:absolute; top:12px; left:12px; background:rgba(17,24,39,0.85); color:#fff; padding:4px 10px; border-radius:9999px; font-size:0.8rem; font-weight:700;">
          ⏱ ${tour.days_nights}
        </span>
      </div>

      <div class="tour-list-info">
        <div>
          <div class="tour-flight-meta">
            <span>✈ ${tour.airline_name}</span>
            <span>•</span>
            <span>📍 ${tour.origin_city} ➔ ${tour.destination_city}</span>
          </div>

          <h3 class="tour-list-title">
            <a href="tour-detail.html?tourId=${tour.id}">${tour.title}</a>
          </h3>

          <div class="tour-flight-details">
            <div>Khởi hành: <strong>${window.formatDateVN(tour.departure_date)}</strong></div>
            <div>Giờ bay: <strong>${tour.flight_time}</strong></div>
            <div>Tàu bay: <strong>${tour.aircraft_type}</strong></div>
            <div>Mã tour: <strong>${tour.tour_code}</strong></div>
          </div>
        </div>

        <p class="tour-list-services">🎁 <strong>Dịch vụ:</strong> ${tour.services}</p>
      </div>

      <div class="tour-list-price-box">
        <div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Giá trọn gói từ</div>
          <div class="tour-list-price">${window.formatVND(tour.price)}</div>
        </div>
        <a href="tour-detail.html?tourId=${tour.id}" class="btn btn-primary btn-sm btn-block">
          Xem Chi Tiết Tour
        </a>
      </div>
    </article>
  `).join('');
}
