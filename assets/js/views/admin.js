/**
 * Noor's Handmade Bangles - Mobile-First PWA Admin Panel
 */

import { t } from '../i18n.js';
import { DataService, getSupabase } from '../supabaseClient.js';
import { formatCurrency, escapeHTML, showToast, compressAndConvertToWebP, exportToCSV } from '../utils.js';
import { store } from '../store.js';
import { CONFIG } from '../config.js';

export async function renderAdminView(container) {
  let adminSession = store.adminSession;

  if (!adminSession) {
    renderAdminLogin(container);
    return;
  }

  renderAdminDashboard(container);
}

function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="container" style="padding: 60px 16px; max-width: 450px;">
      <div style="background: var(--bg-surface); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 1.8rem; color: var(--primary); margin-bottom: 6px;">Admin Portal</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Noor's Shop Management System</p>
        </div>

        <form id="admin-login-form">
          <div class="form-group">
            <label class="form-label">Admin Email *</label>
            <input type="email" id="admin-email" class="form-control" required placeholder="admin@noors.com" value="admin@noors.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Password *</label>
            <input type="password" id="admin-pass" class="form-control" required placeholder="••••••••" value="admin123" />
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-full" style="margin-top: 12px;">
            🔓 Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  `;

  const loginForm = container.querySelector('#admin-login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#admin-email').value.trim();
    const pass = container.querySelector('#admin-pass').value.trim();

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (!error && data.session) {
          store.setAdminSession(data.session);
          showToast('Authenticated via Supabase Auth!', 'success');
          renderAdminDashboard(container);
          return;
        }
      } catch (err) {
        console.warn("Supabase Auth error, checking fallback:", err);
      }
    }

    // Local / Demo Admin Login
    if (email === 'admin@noors.com' && pass === 'admin123') {
      const session = { user: { email: email, role: 'admin' }, token: 'mock-admin-token-' + Date.now() };
      store.setAdminSession(session);
      showToast('Admin session started!', 'success');
      renderAdminDashboard(container);
    } else {
      showToast('Invalid admin credentials', 'error');
    }
  });
}

async function renderAdminDashboard(container) {
  let activeTab = 'orders'; // 'orders', 'products', 'discounts', 'inventory', 'reviews', 'reports'
  let orders = await loadAdminOrders();
  let products = await DataService.getProducts();

  function buildDashboardHTML() {
    return `
      <div class="container" style="padding: 24px 16px;">
        <!-- Top Admin Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 1.8rem; color: var(--primary);">📱 Noor's Admin Panel</h1>
            <span style="font-size: 0.85rem; color: var(--text-muted);">LoggedIn: ${escapeHTML(store.adminSession.user.email)}</span>
          </div>
          <button id="admin-logout-btn" class="btn btn-secondary btn-sm" style="color: var(--danger);">
            🔒 Logout
          </button>
        </div>

        <!-- Admin Nav Tabs (Scrollable on Mobile) -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-color);">
          <button class="btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'} btn-sm admin-tab-btn" data-tab="orders">
            📦 Orders (${orders.length})
          </button>
          <button class="btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'} btn-sm admin-tab-btn" data-tab="products">
            🛍️ Products (${products.length})
          </button>
          <button class="btn ${activeTab === 'discounts' ? 'btn-primary' : 'btn-secondary'} btn-sm admin-tab-btn" data-tab="discounts">
            🏷️ Discounts
          </button>
          <button class="btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'} btn-sm admin-tab-btn" data-tab="inventory">
            📊 Inventory
          </button>
          <button class="btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'} btn-sm admin-tab-btn" data-tab="reports">
            📈 Sales Reports
          </button>
        </div>

        <!-- Tab Content Area -->
        <div id="admin-tab-content"></div>
      </div>
    `;
  }

  container.innerHTML = buildDashboardHTML();

  // Logout listener
  container.querySelector('#admin-logout-btn').addEventListener('click', () => {
    store.setAdminSession(null);
    showToast('Logged out of Admin Panel', 'info');
    renderAdminLogin(container);
  });

  // Tab switch listener
  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      container.querySelectorAll('.admin-tab-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      renderTabContent();
    });
  });

  function renderTabContent() {
    const tabEl = container.querySelector('#admin-tab-content');
    if (!tabEl) return;

    if (activeTab === 'orders') {
      renderOrdersTab(tabEl, orders, refreshOrders);
    } else if (activeTab === 'products') {
      renderProductsTab(tabEl, products, refreshProducts);
    } else if (activeTab === 'discounts') {
      renderDiscountsTab(tabEl, products, refreshProducts);
    } else if (activeTab === 'inventory') {
      renderInventoryTab(tabEl, products, refreshProducts);
    } else if (activeTab === 'reports') {
      renderReportsTab(tabEl, orders);
    }
  }

  async function refreshOrders() {
    orders = await loadAdminOrders();
    renderTabContent();
  }

  async function refreshProducts() {
    products = await DataService.getProducts();
    renderTabContent();
  }

  renderTabContent();
}

async function loadAdminOrders() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn("Supabase fetch orders error:", e);
    }
  }
  return JSON.parse(localStorage.getItem('noors_mock_orders') || '[]');
}

// 1. ORDERS MANAGER TAB
function renderOrdersTab(container, orders, onRefresh) {
  let filterStatus = 'all';

  function renderList() {
    let filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <label style="font-weight: 600; font-size: 0.9rem;">Filter Status:</label>
          <select id="admin-order-status-filter" class="form-control" style="width: auto;">
            <option value="all">All Orders (${orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button id="export-csv-btn" class="btn btn-secondary btn-sm">
          📥 Export Orders CSV
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${filtered.length === 0 ? `<p style="color: var(--text-muted);">No orders found in this view.</p>` : filtered.map(ord => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <strong style="font-size: 1.1rem; color: var(--primary);">${escapeHTML(ord.order_number)}</strong>
                <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 8px;">${new Date(ord.created_at).toLocaleString()}</span>
              </div>

              <!-- Status Change Dropdown -->
              <select class="form-control order-status-select" data-id="${ord.id}" style="width: auto; padding: 4px 10px; font-weight: 700; background: var(--bg-main);">
                ${['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map(st => `
                  <option value="${st}" ${ord.status === st ? 'selected' : ''}>${st.toUpperCase()}</option>
                `).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 0.92rem; margin-bottom: 14px;">
              <div>
                <div><strong>Customer:</strong> ${escapeHTML(ord.customer_name)}</div>
                <div><strong>Phone:</strong> ${escapeHTML(ord.customer_phone)}</div>
                <div><strong>Address:</strong> ${escapeHTML(ord.delivery_address)} (${escapeHTML(ord.delivery_area)})</div>
              </div>
              <div>
                <div><strong>Payment:</strong> ${ord.payment_method.toUpperCase()}</div>
                <div><strong>Total:</strong> ${formatCurrency(ord.total_amount)}</div>
                ${ord.bkash_trx_id || ord.nagad_trx_id ? `<div style="color: var(--success);"><strong>TrxID:</strong> ${escapeHTML(ord.bkash_trx_id || ord.nagad_trx_id)}</div>` : ''}
              </div>
            </div>

            <!-- Action Buttons (1-Tap WhatsApp & Print Packing Slip) -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <button class="btn btn-secondary btn-sm admin-wa-ping" data-phone="${ord.customer_phone}" data-num="${ord.order_number}" data-status="${ord.status}">
                💬 WhatsApp Customer
              </button>
              <button class="btn btn-secondary btn-sm admin-print-slip" data-id="${ord.id}">
                🖨️ Packing Slip
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Filter status dropdown listener
    const filterEl = container.querySelector('#admin-order-status-filter');
    if (filterEl) {
      filterEl.addEventListener('change', (e) => {
        filterStatus = e.target.value;
        renderList();
      });
    }

    // CSV export listener
    const csvBtn = container.querySelector('#export-csv-btn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        const exportRows = orders.map(o => ({
          OrderNumber: o.order_number,
          Date: o.created_at,
          CustomerName: o.customer_name,
          Phone: o.customer_phone,
          Address: o.delivery_address,
          Area: o.delivery_area,
          Total: o.total_amount,
          PaymentMethod: o.payment_method,
          Status: o.status
        }));
        exportToCSV(`Noors_Orders_${new Date().toISOString().slice(0,10)}.csv`, exportRows);
      });
    }

    // Status change listener
    container.querySelectorAll('.order-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const ordId = sel.getAttribute('data-id');
        const newStatus = e.target.value;
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('orders').update({ status: newStatus }).eq('id', ordId);
        } else {
          const ords = JSON.parse(localStorage.getItem('noors_mock_orders') || '[]');
          const idx = ords.findIndex(o => o.id === ordId);
          if (idx > -1) {
            ords[idx].status = newStatus;
            localStorage.setItem('noors_mock_orders', JSON.stringify(ords));
          }
        }
        showToast(`Order status updated to ${newStatus.toUpperCase()}`, 'success');
        onRefresh();
      });
    });

    // 1-Tap WhatsApp message handler
    container.querySelectorAll('.admin-wa-ping').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawPhone = btn.getAttribute('data-phone').replace(/\D/g, '');
        // Ensure international format: prepend 88 only if not already present
        const phone = rawPhone.startsWith('88') ? rawPhone : '88' + rawPhone;
        const num = btn.getAttribute('data-num');
        const status = btn.getAttribute('data-status');
        const waText = `Hello! Your order *${num}* from ${CONFIG.SHOP_NAME} is currently: *${status.toUpperCase()}*. Thank you!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, '_blank');
      });
    });
  }

  renderList();
}

// 2. PRODUCTS MANAGER TAB (With Client WebP Canvas Converter)
function renderProductsTab(container, products, onRefresh) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>Product Catalog (${products.length})</h3>
      <button id="add-product-btn" class="btn btn-primary btn-sm">+ Add New Bangle</button>
    </div>

    <!-- Product Editor Modal (Hidden by default) -->
    <div id="product-modal" style="display: none; background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 28px;">
      <h3 id="prod-modal-title" style="margin-bottom: 16px;">Add New Bangle</h3>
      <form id="product-editor-form">
        <input type="hidden" id="pe-id" />
        <div class="form-group">
          <label class="form-label">Product Name *</label>
          <input type="text" id="pe-name" class="form-control" required placeholder="e.g. Kundan Velvet Bangle Set" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Price (৳) *</label>
            <input type="number" id="pe-price" class="form-control" required placeholder="850" />
          </div>
          <div class="form-group">
            <label class="form-label">Old Price (৳)</label>
            <input type="number" id="pe-old-price" class="form-control" placeholder="1100" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Count *</label>
          <input type="number" id="pe-stock" class="form-control" required placeholder="20" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="pe-desc" class="form-control" rows="3" placeholder="Handcrafted details..."></textarea>
        </div>
        
        <!-- Image Upload with Auto Browser WebP Compression -->
        <div class="form-group">
          <label class="form-label">Product Photo (Auto compressed to WebP < 300KB)</label>
          <input type="file" id="pe-photo-input" class="form-control" accept="image/*" />
          <div id="photo-preview" style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);"></div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button type="submit" class="btn btn-primary">Save Bangle</button>
          <button type="button" id="close-pe-modal" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${products.map(p => `
        <div style="display: flex; gap: 14px; align-items: center; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <img src="${p.images && p.images.length ? p.images[0] : ''}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex-grow: 1;">
            <h4 style="font-size: 1rem;">${escapeHTML(p.name)}</h4>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Price: <strong>${formatCurrency(p.price)}</strong> | Stock: <strong>${p.stock}</strong>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm edit-prod-btn" data-id="${p.id}">Edit</button>
        </div>
      `).join('')}
    </div>
  `;

  // Photo compressed data URL cache
  let uploadedWebPDataUrl = null;

  const photoInput = container.querySelector('#pe-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const res = await compressAndConvertToWebP(file, 1200, 0.8);
          uploadedWebPDataUrl = res.dataUrl;
          container.querySelector('#photo-preview').innerHTML = `
            ✓ Compressed WebP Image Ready (${res.sizeKB} KB)!
          `;
        } catch (err) {
          showToast('Image compression error', 'error');
        }
      }
    });
  }

  // Add Product modal toggle
  const addBtn = container.querySelector('#add-product-btn');
  const modal = container.querySelector('#product-modal');
  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      container.querySelector('#product-editor-form').reset();
      container.querySelector('#pe-id').value = '';
    });
  }

  const closeBtn = container.querySelector('#close-pe-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
}

// 3. DISCOUNTS TAB
function renderDiscountsTab(container, products, onRefresh) {
  container.innerHTML = `
    <div style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      <h3 style="margin-bottom: 16px;">Bulk Discount Action</h3>
      <p style="color: var(--text-muted); margin-bottom: 20px;">Apply percentage discounts across all bangles or promo codes</p>
      
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button id="bulk-10-off-btn" class="btn btn-primary">
          🏷️ Apply 10% Off All Bangles
        </button>
      </div>
    </div>
  `;

  const bulkBtn = container.querySelector('#bulk-10-off-btn');
  if (bulkBtn) {
    bulkBtn.addEventListener('click', () => {
      products.forEach(p => {
        p.old_price = p.price;
        p.price = Math.round(p.price * 0.9);
      });
      showToast('10% discount applied to all products!', 'success');
      onRefresh();
    });
  }
}

// 4. INVENTORY TAB
function renderInventoryTab(container, products, onRefresh) {
  container.innerHTML = `
    <div style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      <h3 style="margin-bottom: 16px;">Stock & Low Inventory Warning</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${products.map(p => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
            <span>${escapeHTML(p.name)}</span>
            <span class="badge ${p.stock < 5 ? 'badge-sale' : 'badge-new'}" style="position: static;">
              ${p.stock < 5 ? `⚠️ Low Stock (${p.stock})` : `In Stock (${p.stock})`}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 5. REPORTS TAB
function renderReportsTab(container, orders) {
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
  const totalOrders = orders.length;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); uppercase;">Total Sales Revenue</div>
        <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${formatCurrency(totalRevenue)}</div>
      </div>

      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); uppercase;">Total Received Orders</div>
        <div style="font-size: 2rem; font-weight: 800;">${totalOrders}</div>
      </div>
    </div>
  `;
}
