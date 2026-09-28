/**
 * Noor's Handmade Bangles - Checkout View & WhatsApp Order Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML, showToast, validateFormSpamProtection } from '../utils.js';
import { store } from '../store.js';
import { CONFIG } from '../config.js';

export function renderCheckoutView(container) {
  const items = store.cart;
  if (items.length === 0) {
    window.location.hash = '#cart';
    return;
  }

  const subtotal = store.getCartSubtotal();
  const discountAmount = store.appliedDiscount ? store.appliedDiscount.discountAmount : 0;
  const deliveryFee = store.selectedDeliveryFee;
  const totalAmount = store.getCartTotal();

  let selectedPaymentMethod = 'cod'; // 'cod', 'bkash', 'nagad'

  container.innerHTML = `
    <div class="container" style="padding: 36px 16px; max-width: 900px;">
      <h1 style="font-size: 2.2rem; margin-bottom: 24px; text-align: center;">${t('checkout_title')}</h1>

      <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 28px;" class="checkout-grid">
        <!-- Customer Form -->
        <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <form id="checkout-form">
            <!-- Honeypot Field -->
            <input type="text" name="website_url_hp" style="display:none;" tabindex="-1" autocomplete="off" />

            <h3 style="margin-bottom: 18px;">Customer Delivery Information</h3>

            <div class="form-group">
              <label class="form-label">${t('customer_name')} *</label>
              <input type="text" id="cust-name" class="form-control" required placeholder="e.g. Sharmin Akter" />
            </div>

            <div class="form-group">
              <label class="form-label">${t('phone_number')} *</label>
              <input type="tel" id="cust-phone" class="form-control" required pattern="[0-9]{11}" placeholder="017XXXXXXXX" />
            </div>

            <div class="form-group">
              <label class="form-label">${t('delivery_address')} *</label>
              <textarea id="cust-address" class="form-control" rows="3" required placeholder="House/Flat No, Road Name/Number, Area Name, District..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">${t('delivery_area')} *</label>
              <select id="cust-area" class="form-control" required>
                <option value="Dhaka City" ${deliveryFee === CONFIG.DELIVERY_DHAKA ? 'selected' : ''}>Inside Dhaka (৳70)</option>
                <option value="Outside Dhaka" ${deliveryFee === CONFIG.DELIVERY_OUTSIDE_DHAKA ? 'selected' : ''}>Outside Dhaka (৳140)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">${t('order_note')}</label>
              <input type="text" id="cust-note" class="form-control" placeholder="Any gift wrapping or delivery timing request..." />
            </div>

            <!-- Payment Options -->
            <h3 style="margin-top: 28px; margin-bottom: 16px;">${t('payment_method')}</h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              <label style="display: flex; align-items: center; gap: 10px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;">
                <input type="radio" name="payment_method" value="cod" checked />
                <div>
                  <strong>${t('cod')}</strong>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">Pay full amount to the delivery rider upon receiving your package</div>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;">
                <input type="radio" name="payment_method" value="bkash" />
                <div>
                  <strong>${t('bkash')}</strong>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">bKash Number: <strong>${CONFIG.BKASH_NUMBER}</strong></div>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;">
                <input type="radio" name="payment_method" value="nagad" />
                <div>
                  <strong>${t('nagad')}</strong>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">Nagad Number: <strong>${CONFIG.NAGAD_NUMBER}</strong></div>
                </div>
              </label>
            </div>

            <!-- bKash / Nagad TrxID Details Box -->
            <div id="trx-id-box" style="display: none; background: var(--accent-light); padding: 18px; border-radius: var(--radius-md); border: 1px dashed var(--accent); margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 0.9rem; font-weight: 600;">Official Number: <strong id="payment-num-display">${CONFIG.BKASH_NUMBER}</strong></span>
                <button type="button" id="copy-pay-num-btn" class="btn btn-secondary btn-sm">Copy Number</button>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Transaction ID (TrxID) *</label>
                <input type="text" id="cust-trxid" class="form-control" placeholder="e.g. 9B7X2M1L0" />
              </div>
            </div>

            <!-- Summary Breakdown -->
            <div style="background: var(--bg-subtle); padding: 18px; border-radius: var(--radius-md); margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>Subtotal (${items.length} items):</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              ${discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--success);">
                  <span>Discount:</span>
                  <span>-${formatCurrency(discountAmount)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Delivery Charge:</span>
                <span>${formatCurrency(deliveryFee)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700; color: var(--primary); border-top: 1px solid var(--border-color); padding-top: 8px;">
                <span>Total Payable:</span>
                <span>${formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button type="submit" id="submit-order-btn" class="btn btn-primary btn-lg btn-full">
              💬 ${t('place_order')}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Payment radio change handler
  const rads = container.querySelectorAll('input[name="payment_method"]');
  const trxBox = container.querySelector('#trx-id-box');
  const payNumDisplay = container.querySelector('#payment-num-display');

  rads.forEach(r => {
    r.addEventListener('change', () => {
      selectedPaymentMethod = r.value;
      if (selectedPaymentMethod === 'bkash' || selectedPaymentMethod === 'nagad') {
        trxBox.style.display = 'block';
        payNumDisplay.textContent = selectedPaymentMethod === 'bkash' ? CONFIG.BKASH_NUMBER : CONFIG.NAGAD_NUMBER;
      } else {
        trxBox.style.display = 'none';
      }
    });
  });

  // Copy payment number handler
  container.querySelector('#copy-pay-num-btn').addEventListener('click', () => {
    const num = selectedPaymentMethod === 'bkash' ? CONFIG.BKASH_NUMBER : CONFIG.NAGAD_NUMBER;
    navigator.clipboard.writeText(num);
    showToast('Payment number copied to clipboard!', 'success');
  });

  // Form Submit Handler
  const form = container.querySelector('#checkout-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateFormSpamProtection(form, 10)) return;

    const name = container.querySelector('#cust-name').value.trim();
    const phone = container.querySelector('#cust-phone').value.trim();
    const address = container.querySelector('#cust-address').value.trim();
    const area = container.querySelector('#cust-area').value;
    const note = container.querySelector('#cust-note').value.trim();
    const trxId = container.querySelector('#cust-trxid') ? container.querySelector('#cust-trxid').value.trim() : '';

    if ((selectedPaymentMethod === 'bkash' || selectedPaymentMethod === 'nagad') && !trxId) {
      showToast('Please enter the bKash / Nagad Transaction ID (TrxID)', 'error');
      return;
    }

    const orderPayload = {
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      delivery_area: area,
      payment_method: selectedPaymentMethod,
      bkash_trx_id: selectedPaymentMethod === 'bkash' ? trxId : '',
      nagad_trx_id: selectedPaymentMethod === 'nagad' ? trxId : '',
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      discount_code: store.appliedDiscount ? store.appliedDiscount.code : '',
      total_amount: totalAmount,
      note: note
    };

    // Save order in database / DataService
    const createdOrder = await DataService.createOrder(orderPayload, items);

    // Build WhatsApp Pre-filled message
    let waText = `🛍️ *NEW ORDER - ${CONFIG.SHOP_NAME}*\n`;
    waText += `*Order Number:* ${createdOrder.order_number}\n\n`;
    waText += `*Customer Details:*\n`;
    waText += `👤 Name: ${name}\n`;
    waText += `📞 Phone: ${phone}\n`;
    waText += `📍 Address: ${address} (${area})\n`;
    if (note) waText += `📝 Note: ${note}\n`;
    waText += `\n*Ordered Items:*\n`;
    
    items.forEach((it, i) => {
      waText += `${i+1}. ${it.name} (Qty: ${it.quantity}${it.selectedSize ? `, Size: ${it.selectedSize}` : ''}${it.selectedColor ? `, Color: ${it.selectedColor}` : ''}) - ৳${it.price * it.quantity}\n`;
    });

    waText += `\n*Payment Summary:*\n`;
    waText += `Subtotal: ৳${subtotal}\n`;
    if (discountAmount > 0) waText += `Discount: -৳${discountAmount}\n`;
    waText += `Delivery Fee: ৳${deliveryFee}\n`;
    waText += `*Total Payable:* ৳${totalAmount}\n`;
    waText += `Payment Method: ${selectedPaymentMethod.toUpperCase()}${trxId ? ` (TrxID: ${trxId})` : ''}\n\n`;
    waText += `Please confirm my order. Thank you!`;

    const waUrl = `https://wa.me/${CONFIG.WHATSAPP_RAW}?text=${encodeURIComponent(waText)}`;

    // Clear cart
    store.clearCart();

    // Open WhatsApp in new window
    window.open(waUrl, '_blank');

    // Render Success Order Confirmation screen
    container.innerHTML = `
      <div class="container" style="padding: 60px 16px; text-align: center; max-width: 650px;">
        <div style="font-size: 4rem; margin-bottom: 16px; color: var(--success);">🎉</div>
        <h1 style="font-size: 2.2rem; margin-bottom: 12px;">${t('order_success_title')}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 24px;">
          ${t('save_order_num_msg')}
        </p>

        <div style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 2px dashed var(--primary); margin-bottom: 28px;">
          <span style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); display: block; margin-bottom: 6px;">${t('order_number_label')}</span>
          <span style="font-size: 2.2rem; font-weight: 800; color: var(--primary); font-family: monospace;">${createdOrder.order_number}</span>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">Phone: ${phone}</div>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a href="#track?order=${createdOrder.order_number}&phone=${encodeURIComponent(phone)}" class="btn btn-primary btn-lg">
            🔍 ${t('track_order')}
          </a>
          <a href="#home" class="btn btn-secondary btn-lg">
            🏠 Return to Home
          </a>
        </div>
      </div>
    `;
  });
}
