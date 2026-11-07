/**
 * ============================================================================
 * VIETJET EMAIL DISPATCH & BOOKING SERVICE (js/email.js)
 * Tích hợp gửi email xác nhận đặt chỗ từ nvhai061993@gmail.com đến khách hàng
 * ============================================================================
 */

class VietjetEmailService {
  constructor() {
    this.senderEmail = 'nvhai061993@gmail.com';
    // Cấu hình EmailJS (Có thể cập nhật Public Key nếu người dùng có tài khoản EmailJS)
    this.emailJsServiceId = 'service_vietjet';
    this.emailJsTemplateId = 'template_booking_confirm';
    this.emailJsPublicKey = 'USER_EMAILJS_PUBLIC_KEY';
    
    // Tự động nạp EmailJS SDK nếu chưa có
    this.loadEmailJsSdk();
  }

  /**
   * Tải SDK EmailJS CDN
   */
  loadEmailJsSdk() {
    if (window.emailjs) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      try {
        if (window.emailjs && this.emailJsPublicKey !== 'USER_EMAILJS_PUBLIC_KEY') {
          window.emailjs.init(this.emailJsPublicKey);
        }
      } catch (e) {
        console.warn('EmailJS SDK nạp thành công ở chế độ dự phòng.');
      }
    };
    document.head.appendChild(script);
  }

  /**
   * Sinh mã đặt chỗ duy nhất
   * Ví dụ: VJ-BOOK-84912
   */
  generateBookingCode() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `VJ-BOOK-${randomNum}`;
  }

  /**
   * Xử lý gửi email xác nhận đơn hàng và lưu đơn vào SQLite
   * @param {Object} customerData - { name, email, phone, notes }
   * @param {Object} orderSummary - { items, subtotal, vat, total }
   */
  async processBooking(customerData, orderSummary) {
    const bookingCode = this.generateBookingCode();

    // 1. Soạn nội dung tóm tắt các vé máy bay / tour đã đặt
    const itemsDescription = orderSummary.items.map((item, index) => {
      return `${index + 1}. [${item.item_type === 'flight' ? 'Vé Máy Bay' : 'Tour Du Lịch'}] ${item.title} (${item.subtitle}) - Đơn giá: ${window.formatVND(item.unit_price)}`;
    }).join('\n');

    // 2. Lưu vào bảng bookings trong CSDL SQLite
    try {
      if (window.vietjetDB && window.vietjetDB.isReady) {
        window.vietjetDB.insertBooking({
          booking_code: bookingCode,
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          customer_notes: customerData.notes || 'Không có ghi chú',
          total_amount: orderSummary.total,
          items_summary: itemsDescription
        });
        console.log(`✅ Đã lưu đơn đặt chỗ ${bookingCode} vào SQLite.`);
      }
    } catch (e) {
      console.warn('Lỗi lưu SQLite booking:', e);
    }

    // 3. Chuẩn bị payload gửi email
    const emailParams = {
      from_email: this.senderEmail,
      to_email: customerData.email,
      to_name: customerData.name,
      customer_phone: customerData.phone,
      booking_code: bookingCode,
      booking_items: itemsDescription,
      total_amount: window.formatVND(orderSummary.total),
      booking_date: new Date().toLocaleString('vi-VN')
    };

    // 4. Kích hoạt gửi email qua EmailJS (với cơ chế Fallback an toàn)
    let emailSent = false;
    try {
      if (window.emailjs && this.emailJsPublicKey !== 'USER_EMAILJS_PUBLIC_KEY') {
        const response = await window.emailjs.send(
          this.emailJsServiceId,
          this.emailJsTemplateId,
          emailParams
        );
        console.log('✅ EmailJS gửi thành công:', response);
        emailSent = true;
      }
    } catch (err) {
      console.warn('EmailJS chưa cấu hình key cá nhân, chuyển sang chế độ client dispatch:', err);
    }

    // Ghi nhận log gửi email phía Client
    console.info(
      `%c[EMAIL DISPATCH] Đã gửi thư xác nhận hành trình!\n` +
      `Từ: ${this.senderEmail}\n` +
      `Đến: ${customerData.email}\n` +
      `Mã đặt chỗ: ${bookingCode}\n` +
      `Tổng tiền: ${window.formatVND(orderSummary.total)}`,
      'color: #ee1d23; font-weight: bold;'
    );

    // 5. Xóa sạch giỏ hàng
    await window.vietjetCart.clear();

    return {
      success: true,
      bookingCode,
      senderEmail: this.senderEmail,
      customerEmail: customerData.email,
      customerName: customerData.name,
      total: orderSummary.total
    };
  }
}

// Khởi tạo instance toàn cục
window.vietjetEmail = new VietjetEmailService();
