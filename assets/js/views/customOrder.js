/**
 * Noor's Handmade Bangles - Custom Order View Generator
 */

import { t } from '../i18n.js';
import { formatCurrency, escapeHTML, showToast, validateFormSpamProtection } from '../utils.js';
import { CONFIG } from '../config.js';

export function renderCustomOrderView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 36px 16px; max-width: 750px;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">${t('custom_title')}</h1>
        <p style="color: var(--text-muted); line-height: 1.6;">${t('custom_desc')}</p>
      </div>

      <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <form id="custom-order-form">
          <!-- Honeypot -->
          <input type="text" name="website_url_hp" style="display:none;" tabindex="-1" autocomplete="off" />

          <div class="form-group">
            <label class="form-label">${t('customer_name')} *</label>
            <input type="text" id="co-name" class="form-control" required placeholder="e.g. Farhana Yasmin" />
          </div>

          <div class="form-group">
            <label class="form-label">${t('phone_number')} *</label>
            <input type="tel" id="co-phone" class="form-control" required pattern="[0-9]{11}" placeholder="017XXXXXXXX" />
          </div>

          <div class="form-group">
            <label class="form-label">${t('wrist_size')} *</label>
            <select id="co-size" class="form-control" required>
              <option value="2.2">2.2 (Small - 2.125 in / 5.4 cm)</option>
              <option value="2.4" selected>2.4 (Medium - 2.25 in / 5.7 cm)</option>
              <option value="2.6">2.6 (Large - 2.375 in / 6.0 cm)</option>
              <option value="2.8">2.8 (XL - 2.5 in / 6.3 cm)</option>
              <option value="2.10">2.10 (XXL - 2.625 in / 6.7 cm)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${t('material')} Preference</label>
            <select id="co-material" class="form-control">
              <option value="Silk Thread">Silk Thread & Zardosi</option>
              <option value="Kundan Bridal">Kundan & Pearl Bridal Set</option>
              <option value="Antique Brass">Antique Brass Kada</option>
              <option value="Glass Reshmi">Glass Reshmi Churi</option>
              <option value="Terracotta">Terracotta Artisan Clay</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${t('design_desc')} *</label>
            <textarea id="co-desc" class="form-control" rows="4" required placeholder="Describe dress color matching, wedding theme, number of pieces, or special request..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-full">
            💬 ${t('submit_custom')}
          </button>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#custom-order-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateFormSpamProtection(form, 10)) return;

    const name = container.querySelector('#co-name').value.trim();
    const phone = container.querySelector('#co-phone').value.trim();
    const size = container.querySelector('#co-size').value;
    const material = container.querySelector('#co-material').value;
    const desc = container.querySelector('#co-desc').value.trim();

    let waText = `✨ *CUSTOM BANGLE REQUEST - ${CONFIG.SHOP_NAME}*\n\n`;
    waText += `👤 Customer: ${name}\n`;
    waText += `📞 Phone: ${phone}\n`;
    waText += `📏 Wrist Size: ${size}\n`;
    waText += `🎨 Preferred Material: ${material}\n\n`;
    waText += `📝 *Design Requirements:*\n${desc}\n\n`;
    waText += `Please contact me with price estimation & design samples!`;

    const waUrl = `https://wa.me/${CONFIG.WHATSAPP_RAW}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
    showToast('Custom request submitted! Opening WhatsApp chat...', 'success');
  });
}
