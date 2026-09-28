/**
 * Noor's Handmade Bangles - Information Pages (About, Contact, FAQ, Size Guide, Policy)
 */

import { t } from '../i18n.js';
import { escapeHTML } from '../utils.js';
import { CONFIG } from '../config.js';

export function renderAboutView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 48px 16px; max-width: 800px;">
      <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 24px;">About Noor's</h1>
      <div style="background: var(--bg-surface); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); line-height: 1.8;">
        <p style="font-size: 1.1rem; margin-bottom: 20px;">
          Welcome to <strong>Noor's Handmade Bangles</strong>, where tradition meets modern elegance. Founded in Dhaka, Bangladesh, Noor's was born out of a passion for authentic handcrafted ethnic jewelry.
        </p>
        <p style="margin-bottom: 20px;">
          Every single bangle set in our shop is meticulously crafted by hand using premium silk threads, zardosi embellishments, Kundan stones, and durable acrylic & metal bases. We believe that jewelry is not just an accessory—it is an expression of heritage, celebration, and love.
        </p>
        <p style="margin-bottom: 20px;">
          Whether you are preparing for your dream wedding, Gaye Holud, Eid celebration, or looking for a memorable personalized gift, Noor's brings you exquisite designs tailored to your exact dress color and wrist size.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; margin-top: 32px; flex-wrap: wrap;">
          <a href="${CONFIG.FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Facebook Page</a>
          <a href="https://wa.me/${CONFIG.WHATSAPP_RAW}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">WhatsApp Us</a>
        </div>
      </div>
    </div>
  `;
}

export function renderContactView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 48px 16px; max-width: 800px;">
      <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 24px;">Contact Us</h1>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
        <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">💬</div>
          <h3>WhatsApp Support</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">Direct chat for quick orders & queries</p>
          <a href="https://wa.me/${CONFIG.WHATSAPP_RAW}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full">${CONFIG.WHATSAPP_NUMBER}</a>
        </div>

        <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📘</div>
          <h3>Facebook Page</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">Follow us for new design drops</p>
          <a href="${CONFIG.FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-full">Noor's Facebook</a>
        </div>

        <div style="background: var(--bg-surface); padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">💸</div>
          <h3>Payment Accounts</h3>
          <p style="color: var(--text-muted); margin-bottom: 8px;">bKash Personal: <strong>${CONFIG.BKASH_NUMBER}</strong></p>
          <p style="color: var(--text-muted);">Nagad Personal: <strong>${CONFIG.NAGAD_NUMBER}</strong></p>
        </div>
      </div>
    </div>
  `;
}

export function renderFAQView(container) {
  const faqs = [
    { q: "How long does delivery take inside Dhaka?", a: "Delivery inside Dhaka takes 1 to 2 business days. Delivery fee is ৳70." },
    { q: "How long does delivery take outside Dhaka?", a: "Delivery outside Dhaka takes 2 to 4 business days via courier. Delivery fee is ৳140." },
    { q: "Can I customize the color and size of a bangle set?", a: "Yes! We specialize in custom matching sets for Gaye Holud, weddings, and special events. Use our 'Custom Order' page or message us on WhatsApp." },
    { q: "How do I pay for my order?", a: "We accept Cash on Delivery (COD), bKash, and Nagad." },
    { q: "How do I know my bangle size?", a: "Measure your wrist circumference or check our interactive Size Guide page." }
  ];

  container.innerHTML = `
    <div class="container" style="padding: 48px 16px; max-width: 800px;">
      <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 24px;">Frequently Asked Questions</h1>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${faqs.map(faq => `
          <div style="background: var(--bg-surface); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h3 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 8px;">Q: ${escapeHTML(faq.q)}</h3>
            <p style="color: var(--text-muted); font-size: 0.98rem; line-height: 1.6;">${escapeHTML(faq.a)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderSizeGuideView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 48px 16px; max-width: 800px;">
      <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 12px;">Bangle Size Guide</h1>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 32px;">Measure your hand at its widest point or measure the inner diameter of an existing well-fitting bangle.</p>

      <div style="overflow-x: auto; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 20px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color);">
              <th style="padding: 12px;">Standard Bangle Size</th>
              <th style="padding: 12px;">Inner Diameter (Inches)</th>
              <th style="padding: 12px;">Inner Diameter (cm)</th>
              <th style="padding: 12px;">Hand Circumference</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px; font-weight: 700;">2.2 (XS/S)</td>
              <td style="padding: 12px;">2.125 in</td>
              <td style="padding: 12px;">5.4 cm</td>
              <td style="padding: 12px;">6.6 - 7.0 in</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px; font-weight: 700;">2.4 (Medium - Most Popular)</td>
              <td style="padding: 12px;">2.25 in</td>
              <td style="padding: 12px;">5.7 cm</td>
              <td style="padding: 12px;">7.0 - 7.4 in</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px; font-weight: 700;">2.6 (Large)</td>
              <td style="padding: 12px;">2.375 in</td>
              <td style="padding: 12px;">6.0 cm</td>
              <td style="padding: 12px;">7.4 - 7.8 in</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px; font-weight: 700;">2.8 (XL)</td>
              <td style="padding: 12px;">2.50 in</td>
              <td style="padding: 12px;">6.3 cm</td>
              <td style="padding: 12px;">7.8 - 8.2 in</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: 700;">2.10 (XXL)</td>
              <td style="padding: 12px;">2.625 in</td>
              <td style="padding: 12px;">6.7 cm</td>
              <td style="padding: 12px;">8.2 - 8.6 in</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderPolicyView(container) {
  container.innerHTML = `
    <div class="container" style="padding: 48px 16px; max-width: 800px;">
      <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 24px;">Delivery & Return Policy</h1>
      <div style="background: var(--bg-surface); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); line-height: 1.8;">
        <h3 style="color: var(--primary); margin-bottom: 12px;">🚚 Delivery Charges</h3>
        <ul style="margin-left: 20px; margin-bottom: 24px;">
          <li>Inside Dhaka City: ৳70 (1-2 Days)</li>
          <li>Outside Dhaka: ৳140 (2-4 Days)</li>
        </ul>

        <h3 style="color: var(--primary); margin-bottom: 12px;">🔄 Return & Replacement Policy</h3>
        <p style="margin-bottom: 16px;">
          Customer satisfaction is our top priority. If you receive a damaged product or wrong size:
        </p>
        <ul style="margin-left: 20px; margin-bottom: 24px;">
          <li>Please inspect the package in front of the delivery rider upon arrival.</li>
          <li>In case of breakage during transit, record a quick unboxing photo/video and inform us immediately via WhatsApp.</li>
          <li>We will replace broken items free of charge.</li>
        </ul>
      </div>
    </div>
  `;
}
