/**
 * Noor's Handmade Bangles - Order Tracking View Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML, showToast } from '../utils.js';

export function renderTrackView(container, params = {}) {
  let initialOrder = params.order || '';
  let initialPhone = params.phone || '';

  container.innerHTML = `
    <div class="container" style="padding: 36px 16px; max-width: 750px;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">${t('track_order_title')}</h1>
        <p style="color: var(--text-muted);">Enter your 6-digit Order Number and registered Phone Number to check real-time status</p>
      </div>

      <div style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 32px;">
        <form id="track-order-form">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">${t('enter_order_num')} *</label>
              <input type="text" id="track-order-input" class="form-control" required placeholder="e.g. NOR-1001" value="${escapeHTML(initialOrder)}" />
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">${t('enter_phone')} *</label>
              <input type="tel" id="track-phone-input" class="form-control" required placeholder="017XXXXXXXX" value="${escapeHTML(initialPhone)}" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-full">
            🔍 ${t('track_button')}
          </button>
        </form>
      </div>

      <div id="track-result-container"></div>
    </div>
  `;

  async function performTracking(orderNum, phoneNum) {
    const resultContainer = container.querySelector('#track-result-container');
    resultContainer.innerHTML = `<div style="text-align: center; padding: 40px;"><div class="spinner">Searching order records...</div></div>`;

    const orderData = await DataService.trackOrder(orderNum, phoneNum);

    if (!orderData) {
      resultContainer.innerHTML = `
        <div style="text-align: center; background: var(--bg-surface); padding: 40px 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
          <h3 style="margin-bottom: 8px;">Order Not Found</h3>
          <p style="color: var(--text-muted);">Please double check your Order Number and Phone Number. Both must match our records.</p>
        </div>
      `;
      return;
    }

    const statuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentStatusIndex = statuses.indexOf(orderData.status.toLowerCase());
    const isCancelled = orderData.status.toLowerCase() === 'cancelled';

    resultContainer.innerHTML = `
      <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); uppercase; letter-spacing: 0.05em;">Order Number</span>
            <h2 style="font-size: 1.6rem; color: var(--primary);">${escapeHTML(orderData.order_number)}</h2>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Placed On</span>
            <div style="font-weight: 600;">${new Date(orderData.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Status Timeline Stepper -->
        ${isCancelled ? `
          <div style="background: var(--primary-light); color: var(--danger); padding: 16px; border-radius: var(--radius-md); text-align: center; font-weight: 700; margin-bottom: 24px;">
            ✖ Order Status: CANCELLED
          </div>
        ` : `
          <div style="margin-bottom: 32px; padding: 10px 0;">
            <div style="display: flex; justify-content: space-between; position: relative;">
              <!-- Timeline Bar -->
              <div style="position: absolute; top: 18px; left: 10%; right: 10%; height: 4px; background: var(--border-color); z-index: 1;">
                <div style="height: 100%; width: ${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%; background: var(--primary); transition: width 0.4s ease;"></div>
              </div>

              ${statuses.map((st, i) => {
                const isActive = i <= currentStatusIndex;
                return `
                  <div style="position: relative; z-index: 2; text-align: center; width: 20%;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isActive ? 'var(--primary)' : 'var(--bg-surface)'}; border: 2px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}; color: ${isActive ? '#FFF' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 8px;">
                      ${isActive ? '✓' : i + 1}
                    </div>
                    <div style="font-size: 0.75rem; font-weight: ${isActive ? '700' : '500'}; color: ${isActive ? 'var(--text-main)' : 'var(--text-muted)'}; text-transform: capitalize;">
                      ${t('status_' + st)}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `}

        <!-- Customer & Order Details Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; background: var(--bg-subtle); padding: 18px; border-radius: var(--radius-md);">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 6px;">Customer Details</h4>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              <div><strong>Name:</strong> ${escapeHTML(orderData.customer_name)}</div>
              <div><strong>Phone:</strong> ${escapeHTML(orderData.customer_phone)}</div>
              <div><strong>Address:</strong> ${escapeHTML(orderData.delivery_address)}</div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 6px;">Payment & Total</h4>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              <div><strong>Total Amount:</strong> ${formatCurrency(orderData.total_amount)}</div>
              <div><strong>Payment Method:</strong> ${orderData.payment_method.toUpperCase()}</div>
              ${orderData.tracking_note ? `<div style="margin-top: 6px; color: var(--primary);"><strong>Admin Note:</strong> ${escapeHTML(orderData.tracking_note)}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const trackForm = container.querySelector('#track-order-form');
  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ord = container.querySelector('#track-order-input').value.trim();
    const ph = container.querySelector('#track-phone-input').value.trim();
    performTracking(ord, ph);
  });

  if (initialOrder && initialPhone) {
    performTracking(initialOrder, initialPhone);
  }
}
