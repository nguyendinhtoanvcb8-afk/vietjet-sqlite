/**
 * ============================================================================
 * VIETJET MAIN RUNTIME & COMMON HELPERS (js/main.js)
 * Shared Navigation, DB bootstrap, Toast, and Formatting utilities
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Tạo Toast Container nếu chưa có
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // 2. Khởi tạo Database SQLite WebAssembly
  try {
    if (window.vietjetDB) {
      await window.vietjetDB.init();
    }
  } catch (e) {
    console.warn('Khởi tạo DB ban đầu chưa sẵn sàng:', e);
  }

  // 3. Cập nhật Badge giỏ hàng
  if (window.vietjetCart) {
    await window.vietjetCart.updateBadge();
  }

  // 4. Đánh dấu menu đang active
  highlightActiveNavLink();

  // 5. Xử lý Toggle Menu trên Mobile
  setupMobileMenu();
});

/**
 * Đánh dấu trang hiện tại trên thanh điều hướng
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Điều khiển mở/đóng menu responsive trên điện thoại
 */
function setupMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('span') || mobileToggle;
      icon.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Bấm ra ngoài thì đóng menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('span') || mobileToggle;
        icon.textContent = '☰';
      }
    });
  }
}

/**
 * Tiện ích hiển thị thông báo Toast đẹp mắt
 * @param {string} message - Nội dung thông báo
 * @param {'success'|'warning'|'danger'|'info'} type - Loại thông báo
 * @param {string} title - Tiêu đề phụ
 */
window.showToast = function (message, type = 'info', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    warning: '⚠',
    danger: '✕',
    info: 'ℹ'
  };

  const defaultTitles = {
    success: 'Thành công!',
    warning: 'Lưu ý!',
    danger: 'Thất bại!',
    info: 'Thông báo'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Tự động biến mất sau 3.5 giây
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3500);
};

/**
 * Định dạng tiền tệ Việt Nam Đồng (VNĐ)
 * Ví dụ: 1290000 -> "1.290.000 ₫"
 */
window.formatVND = function (amount) {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Trích xuất tham số Query String từ URL
 * Ví dụ: ?from=SGN&airline=Vietjet -> { from: "SGN", airline: "Vietjet" }
 */
window.getQueryParams = function () {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
};

/**
 * Định dạng ngày YYYY-MM-DD sang chuẩn Việt Nam DD/MM/YYYY
 */
window.formatDateVN = function (dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};
