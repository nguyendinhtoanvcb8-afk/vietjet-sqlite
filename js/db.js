/**
 * ============================================================================
 * VIETJET CLIENT-SIDE SQLITE DATABASE ENGINE (sql.js WebAssembly)
 * Tự động nạp dữ liệu từ tệp SQLite vật lý db.db (hoặc sqlite/db.db)
 * ============================================================================
 */

class VietjetDB {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.storageKey = 'vietjet_sqlite_db_v1';
    this.isReady = false;
    this.initPromise = null;
    this.dbSource = 'unknown';
  }

  /**
   * Khởi tạo WebAssembly SQLite và nạp dữ liệu từ file db.db
   */
  async init(forceReload = false) {
    if (!forceReload && this.isReady && this.db) return this.db;
    if (!forceReload && this.initPromise) return this.initPromise;

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        // 1. Tải sql.js WebAssembly nếu chưa có
        if (typeof window.initSqlJs !== 'function') {
          await this.loadSqlJsScript();
        }

        this.SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        let binaryData = null;

        // 2. ƯU TIÊN 1: Nạp trực tiếp tệp vật lý db.db (hoặc sqlite/db.db) qua HTTP Fetch
        const dbPaths = ['sqlite/db.db', 'db.db', './sqlite/db.db', './db.db', '/sqlite/db.db'];
        for (const path of dbPaths) {
          try {
            const resp = await fetch(path, { cache: 'no-cache' });
            if (resp.ok) {
              const buffer = await resp.arrayBuffer();
              if (buffer && buffer.byteLength > 0) {
                binaryData = new Uint8Array(buffer);
                this.dbSource = `File: ${path}`;
                console.log(`✅ Vietjet SQLite: Đã nạp thành công từ tệp vật lý ${path} (${binaryData.byteLength} bytes)`);
                break;
              }
            }
          } catch (fetchErr) {
            // Tiếp tục thử đường dẫn tiếp theo
          }
        }

        // 3. ƯU TIÊN 2: Nếu mở qua giao thức file:/// (bị chặn CORS Fetch), dùng nhị phân Base64 từ js/db_binary.js
        if (!binaryData && window.VIETJET_DB_BINARY_B64) {
          try {
            const binaryString = atob(window.VIETJET_DB_BINARY_B64);
            binaryData = Uint8Array.from(binaryString, c => c.charCodeAt(0));
            this.dbSource = 'db_binary.js (db.db embedded)';
            console.log(`✅ Vietjet SQLite: Đã nạp dữ liệu từ tệp db.db nhúng (${binaryData.byteLength} bytes)`);
          } catch (b64Err) {
            console.warn('Lỗi đọc Base64 từ db_binary.js:', b64Err);
          }
        }

        // 4. ƯU TIÊN 3: Kiểm tra dữ liệu phiên làm việc trong localStorage nếu chưa nạp được file
        if (!binaryData) {
          const savedData = localStorage.getItem(this.storageKey);
          if (savedData) {
            try {
              const binaryString = atob(savedData);
              binaryData = Uint8Array.from(binaryString, c => c.charCodeAt(0));
              this.dbSource = 'localStorage cache';
              console.log('✅ Vietjet SQLite: Đã khôi phục CSDL từ localStorage cache.');
            } catch (e) {
              console.warn('Lỗi khôi phục localStorage:', e);
            }
          }
        }

        // 5. Khởi tạo SQLite Database từ Binary nạp được
        if (binaryData) {
          this.db = new this.SQL.Database(binaryData);
          // Đồng bộ lại các mục trong giỏ hàng hiện hành nếu có
          this.restoreCartSession();
          this.save();
        } else {
          // Trường hợp bất khả kháng không có file -> Tạo database trắng và nạp schema dự phòng
          console.warn('⚠️ Không tìm thấy file db.db, tiến hành khởi tạo Schema mặc định');
          await this.createNewDatabase();
        }

        this.isReady = true;
        resolve(this.db);
      } catch (err) {
        console.error('❌ Lỗi khởi tạo SQLite WebAssembly:', err);
        reject(err);
      }
    });

    return this.initPromise;
  }

  /**
   * Tải động script sql-wasm.js từ CDN nếu trang chưa nạp
   */
  loadSqlJsScript() {
    return new Promise((resolve, reject) => {
      if (window.initSqlJs) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Không thể tải sql-wasm.js từ CDN'));
      document.head.appendChild(script);
    });
  }

  /**
   * Khôi phục các mặt hàng trong giỏ từ session nếu có
   */
  restoreCartSession() {
    try {
      const fallback = localStorage.getItem('vietjet_cart_fallback_v1');
      if (fallback) {
        const items = JSON.parse(fallback);
        if (Array.isArray(items) && items.length > 0) {
          // Kiểm tra bảng cart_items
          const currentCount = this.query('SELECT COUNT(*) as cnt FROM cart_items')[0]?.cnt || 0;
          if (currentCount === 0) {
            for (const item of items) {
              this.run(
                'INSERT INTO cart_items (item_type, item_id, title, subtitle, unit_price, quantity, flight_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [item.item_type, item.item_id, item.title, item.subtitle, item.unit_price, item.quantity, item.flight_date]
              );
            }
          }
        }
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ giỏ hàng:', e);
    }
  }

  /**
   * Lưu trạng thái nhị phân SQLite vào localStorage
   */
  save() {
    if (!this.db) return;
    try {
      const binary = this.db.export();
      let binaryString = '';
      const bytes = new Uint8Array(binary);
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, chunk);
      }
      localStorage.setItem(this.storageKey, btoa(binaryString));
    } catch (e) {
      console.warn('Không thể lưu SQLite binary vào localStorage:', e);
    }
  }

  /**
   * Truy vấn SELECT trả về danh sách đối tượng
   */
  query(sql, params = []) {
    if (!this.db) {
      console.error('Database chưa được khởi tạo!');
      return [];
    }
    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } catch (err) {
      console.error('Lỗi thực thi query SQL:', sql, err);
      return [];
    }
  }

  /**
   * Thực thi câu lệnh INSERT / UPDATE / DELETE và tự động lưu
   */
  run(sql, params = []) {
    if (!this.db) return false;
    try {
      this.db.run(sql, params);
      this.save();
      return true;
    } catch (err) {
      console.error('Lỗi run SQL:', sql, err);
      return false;
    }
  }

  // =========================================================================
  // HELPER METHODS CHO ỨNG DỤNG
  // =========================================================================

  getAirlines() {
    return this.query('SELECT * FROM airlines ORDER BY id ASC');
  }

  getFeaturedTours() {
    const sql = `
      SELECT t.*, a.name AS airline_name, a.code AS airline_code, a.logo_url AS airline_logo
      FROM tours t
      JOIN airlines a ON t.airline_id = a.id
      WHERE t.is_featured = 1
      ORDER BY t.id ASC
      LIMIT 8
    `;
    return this.query(sql);
  }

  queryTours({ airlineIds = [], maxPrice, duration, sortBy = 'default' } = {}) {
    let sql = `
      SELECT t.*, a.name AS airline_name, a.code AS airline_code, a.logo_url AS airline_logo
      FROM tours t
      JOIN airlines a ON t.airline_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (airlineIds && airlineIds.length > 0) {
      const placeholders = airlineIds.map(() => '?').join(',');
      sql += ` AND t.airline_id IN (${placeholders})`;
      params.push(...airlineIds);
    }

    if (maxPrice) {
      sql += ` AND t.price <= ?`;
      params.push(maxPrice);
    }

    if (duration) {
      if (duration === 'short') sql += ` AND t.duration_days <= 3`;
      else if (duration === 'medium') sql += ` AND t.duration_days BETWEEN 4 AND 5`;
      else if (duration === 'long') sql += ` AND t.duration_days > 5`;
    }

    if (sortBy === 'price_asc') sql += ` ORDER BY t.price ASC`;
    else if (sortBy === 'price_desc') sql += ` ORDER BY t.price DESC`;
    else sql += ` ORDER BY t.id ASC`;

    return this.query(sql, params);
  }

  getTourById(id) {
    const sql = `
      SELECT t.*, a.name AS airline_name, a.code AS airline_code, a.logo_url AS airline_logo
      FROM tours t
      JOIN airlines a ON t.airline_id = a.id
      WHERE t.id = ?
    `;
    const res = this.query(sql, [id]);
    return res.length > 0 ? res[0] : null;
  }

  queryFlights({
    origin,
    destination,
    airlineIds = [],
    flightType,
    timeRange,
    serviceClass,
    sortBy = 'default'
  } = {}) {
    let sql = `
      SELECT f.*, a.name AS airline_name, a.code AS airline_code, a.logo_url AS airline_logo
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (origin) {
      sql += ` AND (f.origin_code = ? OR f.origin_city LIKE ?)`;
      params.push(origin, `%${origin}%`);
    }

    if (destination) {
      sql += ` AND (f.destination_code = ? OR f.destination_city LIKE ?)`;
      params.push(destination, `%${destination}%`);
    }

    if (flightType && flightType !== 'all') {
      sql += ` AND f.flight_type = ?`;
      params.push(flightType);
    }

    if (airlineIds && airlineIds.length > 0) {
      const placeholders = airlineIds.map(() => '?').join(',');
      sql += ` AND f.airline_id IN (${placeholders})`;
      params.push(...airlineIds);
    }

    // Lọc theo khung giờ cất cánh
    if (timeRange) {
      if (timeRange === 'early') sql += ` AND f.departure_time BETWEEN '00:00' AND '06:00'`;
      else if (timeRange === 'morning') sql += ` AND f.departure_time BETWEEN '06:00' AND '12:00'`;
      else if (timeRange === 'afternoon') sql += ` AND f.departure_time BETWEEN '12:00' AND '18:00'`;
      else if (timeRange === 'night') sql += ` AND f.departure_time BETWEEN '18:00' AND '23:59'`;
    }

    // Sắp xếp
    if (sortBy === 'price_asc') {
      const priceCol = serviceClass === 'business' ? 'f.price_business' : 'f.price_economy';
      sql += ` ORDER BY ${priceCol} ASC`;
    } else if (sortBy === 'price_desc') {
      const priceCol = serviceClass === 'business' ? 'f.price_business' : 'f.price_economy';
      sql += ` ORDER BY ${priceCol} DESC`;
    } else {
      sql += ` ORDER BY f.departure_time ASC`;
    }

    return this.query(sql, params);
  }

  getFlightById(id) {
    const sql = `
      SELECT f.*, a.name AS airline_name, a.code AS airline_code, a.logo_url AS airline_logo
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      WHERE f.id = ?
    `;
    const res = this.query(sql, [id]);
    return res.length > 0 ? res[0] : null;
  }

  // ---------------- Giỏ Hàng & Đặt Chỗ ----------------
  getCartItems() {
    return this.query('SELECT * FROM cart_items ORDER BY id DESC');
  }

  addCartItem({ item_type, item_id, title, subtitle, unit_price, quantity = 1, flight_date = '' }) {
    const sql = `
      INSERT INTO cart_items (item_type, item_id, title, subtitle, unit_price, quantity, flight_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const success = this.run(sql, [item_type, item_id, title, subtitle, unit_price, quantity, flight_date]);
    return success;
  }

  removeCartItem(id) {
    return this.run('DELETE FROM cart_items WHERE id = ?', [id]);
  }

  clearCart() {
    return this.run('DELETE FROM cart_items');
  }

  insertBooking({ booking_code, customer_name, customer_email, customer_phone, customer_notes, total_amount, items_summary }) {
    const sql = `
      INSERT INTO bookings (booking_code, customer_name, customer_email, customer_phone, customer_notes, total_amount, items_summary, email_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'SENT')
    `;
    return this.run(sql, [booking_code, customer_name, customer_email, customer_phone, customer_notes, total_amount, items_summary]);
  }
}

// Khởi tạo instance toàn cục
window.vietjetDB = new VietjetDB();
