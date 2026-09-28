/**
 * Noor's Handmade Bangles - Cart View & Drawer Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML, showToast } from '../utils.js';
import { store } from '../store.js';
import { CONFIG } from '../config.js';

export function renderCartView(container) {
  const items = store.cart;
  const subtotal = store.getCartSubtotal();
  const deliveryFee = store.selectedDeliveryFee;

  container.innerHTML = `
    <div class="container" style="padding: 36px 16px; max-width: 900px;">
      <h1 style="font-size: 2.2rem; margin-bottom: 24px; text-align: center;">${t('shopping_cart')}</h1>

      ${items.length === 0 ? `
        <div style="text-align: center; padding: 60px 0; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 3.5rem; margin-bottom: 14px;">🛍️</div>
          <h2 style="margin-bottom: 12px;">${t('cart_empty')}</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Browse our handcrafted bangle collections to add items!</p>
          <a href="#shop" class="btn btn-primary btn-lg">${t('shop_now')}</a>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
          <!-- Items List -->
          <div style="background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color); padding: 20px;">
            ${items.map((item, idx) => `
              <div style="display: flex; gap: 16px; align-items: center; padding: 14px 0; border-bottom: ${idx < items.length - 1 ? '1px solid var(--border-color)' : 'none'};">
                <img src="${item.image}" alt="${escapeHTML(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);" />
                
                <div style="flex-grow: 1;">
                  <h4 style="font-size: 1rem; margin-bottom: 4px;">${escapeHTML(item.name)}</h4>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
                    ${item.selectedSize ? `Size: <strong>${item.selectedSize}</strong>` : ''} 
                    ${item.selectedColor ? `| Color: <strong>${item.selectedColor}</strong>` : ''}
                  </div>
                  <span style="font-weight: 700; color: var(--primary);">${formatCurrency(item.price)}</span>
                </div>

                <!-- Quantity Controls -->
                <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                  <button class="cart-qty-btn" data-action="minus" data-idx="${idx}" style="padding: 4px 10px;">-</button>
                  <span style="padding: 0 10px; font-weight: 600;">${item.quantity}</span>
                  <button class="cart-qty-btn" data-action="plus" data-idx="${idx}" style="padding: 4px 10px;">+</button>
                </div>

                <!-- Total & Remove -->
                <div style="text-align: right; min-width: 80px;">
                  <div style="font-weight: 700;">${formatCurrency(item.price * item.quantity)}</div>
                  <button class="cart-remove-btn" data-idx="${idx}" style="color: var(--danger); font-size: 0.85rem; margin-top: 4px; border-bottom: 1px dotted var(--danger);">
                    Remove
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Summary & Delivery Charge Selection -->
          <div style="background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color); padding: 24px;">
            <h3 style="margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Order Summary</h3>
            
            <div class="form-group">
              <label class="form-label">${t('delivery_area')} *</label>
              <select id="cart-delivery-area" class="form-control">
                <option value="dhaka" ${deliveryFee === CONFIG.DELIVERY_DHAKA ? 'selected' : ''}>${t('dhaka_inside')}</option>
                <option value="outside" ${deliveryFee === CONFIG.DELIVERY_OUTSIDE_DHAKA ? 'selected' : ''}>${t('dhaka_outside')}</option>
              </select>
            </div>

            <!-- Discount Code Input -->
            <div class="form-group">
              <label class="form-label">${t('discount_code')}</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="cart-coupon-code" class="form-control" placeholder="e.g. NOOR10" value="${store.appliedDiscount ? store.appliedDiscount.code : ''}" />
                <button id="apply-coupon-btn" class="btn btn-secondary">${t('apply_code')}</button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>${t('subtotal')}</span>
              <strong>${formatCurrency(subtotal)}</strong>
            </div>

            ${store.appliedDiscount ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--success);">
                <span>Discount (${store.appliedDiscount.code})</span>
                <strong>-${formatCurrency(store.appliedDiscount.discountAmount)}</strong>
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
              <span>Delivery Fee</span>
              <strong>${formatCurrency(store.selectedDeliveryFee)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 700; color: var(--primary); border-top: 1px solid var(--border-color); padding-top: 14px; margin-bottom: 24px;">
              <span>${t('total')}</span>
              <span>${formatCurrency(store.getCartTotal())}</span>
            </div>

            <a href="#checkout" class="btn btn-primary btn-lg btn-full">
              ${t('proceed_checkout')} →
            </a>
          </div>
        </div>
      `}
    </div>
  `;

  // Quantity button event handlers
  container.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const action = btn.getAttribute('data-action');
      const currentQty = store.cart[idx].quantity;
      const newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;
      store.updateCartQuantity(idx, newQty);
      renderCartView(container);
    });
  });

  // Remove item event handler
  container.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      store.removeFromCart(idx);
      renderCartView(container);
    });
  });

  // Delivery Area change handler
  const deliverySelect = container.querySelector('#cart-delivery-area');
  if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      store.selectedDeliveryFee = val === 'dhaka' ? CONFIG.DELIVERY_DHAKA : CONFIG.DELIVERY_OUTSIDE_DHAKA;
      renderCartView(container);
    });
  }

  // Coupon apply button handler
  const applyCouponBtn = container.querySelector('#apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', async () => {
      const codeInput = container.querySelector('#cart-coupon-code').value;
      if (!codeInput.trim()) return;

      const res = await DataService.validateDiscountCode(codeInput, subtotal);
      if (res.valid) {
        store.appliedDiscount = res;
        showToast(`Discount applied! Saved ${formatCurrency(res.discountAmount)}`, 'success');
      } else {
        showToast(res.message, 'error');
        store.appliedDiscount = null;
      }
      renderCartView(container);
    });
  }
}
