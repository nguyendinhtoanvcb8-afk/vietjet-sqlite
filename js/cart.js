/**
 * ============================================================================
 * VIETJET CART SERVICE (js/cart.js)
 * Quản lý giỏ hàng phía Client - Đồng bộ trực tiếp với SQLite & LocalStorage
 * ============================================================================
 */

class VietjetCartService {
  constructor() {
    this.fallbackKey = 'vietjet_cart_fallback_v1';
  }

  /**
   * Lấy toàn bộ sản phẩm trong giỏ
   */
  async getItems() {
    try {
      if (window.vietjetDB && window.vietjetDB.isReady) {
        return window.vietjetDB.getCartItems();
      }
      // Fallback nếu DB chưa khởi tạo xong
      const raw = localStorage.getItem(this.fallbackKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Lỗi đọc giỏ hàng:', e);
      return [];
    }
  }

  /**
   * Thêm chuyến bay hoặc tour vào giỏ hàng
   */
  async addItem({ item_type, item_id, title, subtitle, unit_price, quantity = 1, flight_date = '' }) {
    try {
      if (window.vietjetDB && window.vietjetDB.isReady) {
        window.vietjetDB.addCartItem({
          item_type,
          item_id,
          title,
          subtitle,
          unit_price,
          quantity,
          flight_date
        });
      }

      // Luôn backup một bản vào localStorage để truy xuất tức thời
      const items = await this.getItems();
      // Nếu DB chưa có bản ghi, thêm vào fallback
      if (!window.vietjetDB || !window.vietjetDB.isReady) {
        const newItem = {
          id: Date.now(),
          item_type,
          item_id,
          title,
          subtitle,
          unit_price,
          quantity,
          flight_date,
          created_at: new Date().toISOString()
        };
        items.unshift(newItem);
        localStorage.setItem(this.fallbackKey, JSON.stringify(items));
      }

      this.notifyUpdate();
      return true;
    } catch (e) {
      console.error('Lỗi thêm vào giỏ hàng:', e);
      return false;
    }
  }

  /**
   * Xóa 1 mục khỏi giỏ hàng
   */
  async removeItem(id) {
    try {
      if (window.vietjetDB && window.vietjetDB.isReady) {
        window.vietjetDB.removeCartItem(id);
      }
      // Cập nhật fallback
      const raw = localStorage.getItem(this.fallbackKey);
      if (raw) {
        const items = JSON.parse(raw).filter(item => item.id !== id);
        localStorage.setItem(this.fallbackKey, JSON.stringify(items));
      }
      this.notifyUpdate();
      return true;
    } catch (e) {
      console.error('Lỗi xóa mục giỏ hàng:', e);
      return false;
    }
  }

  /**
   * Xóa sạch toàn bộ giỏ hàng
   */
  async clear() {
    try {
      if (window.vietjetDB && window.vietjetDB.isReady) {
        window.vietjetDB.clearCart();
      }
      localStorage.removeItem(this.fallbackKey);
      this.notifyUpdate();
      return true;
    } catch (e) {
      console.error('Lỗi làm rỗng giỏ hàng:', e);
      return false;
    }
  }

  /**
   * Tính toán tổng tiền, VAT và số lượng
   */
  async getSummary() {
    const items = await this.getItems();
    const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.unit_price) * (Number(item.quantity) || 1)), 0);
    const vat = Math.round(subtotal * 0.08); // Thuế VAT 8%
    const total = subtotal + vat;

    return {
      items,
      count,
      subtotal,
      vat,
      total
    };
  }

  /**
   * Cập nhật số lượng trên icon giỏ hàng ở Header
   */
  async updateBadge() {
    const summary = await this.getSummary();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = summary.count;
      badge.style.display = summary.count > 0 ? 'flex' : 'none';
    });
  }

  /**
   * Bắn sự kiện cập nhật để các trang khác tự render lại
   */
  notifyUpdate() {
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('vietjet:cart-updated'));
  }
}

// Khởi tạo instance toàn cục
window.vietjetCart = new VietjetCartService();
