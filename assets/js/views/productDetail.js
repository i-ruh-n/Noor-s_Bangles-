/**
 * Noor's Handmade Bangles - Product Detail View Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML, showToast, validateFormSpamProtection } from '../utils.js';
import { store } from '../store.js';
import { renderProductCardHTML, attachProductCardEvents } from './home.js';

export async function renderProductDetailView(container, params = {}) {
  const productId = params.id;
  if (!productId) {
    window.location.hash = '#shop';
    return;
  }

  const product = await DataService.getProductById(productId);
  if (!product) {
    container.innerHTML = `
      <div class="container" style="text-align: center; padding: 80px 16px;">
        <h2>Product Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">The requested product could not be found or is inactive.</p>
        <a href="#shop" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
    return;
  }

  const reviews = await DataService.getReviewsForProduct(product.id);
  const relatedProducts = await DataService.getProducts({ category_id: product.category_id });
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  let selectedSize = product.sizes && product.sizes.length ? product.sizes[0] : '';
  let selectedColor = product.colors && product.colors.length ? product.colors[0] : '';
  let quantity = 1;
  let activeImageIndex = 0;

  const images = product.images && product.images.length ? product.images : [''];

  container.innerHTML = `
    <div class="container" style="padding: 36px 16px;">
      <!-- Breadcrumb Navigation -->
      <nav style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 24px;">
        <a href="#home">Home</a> &nbsp;/&nbsp; <a href="#shop">Shop</a> &nbsp;/&nbsp; <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(product.name)}</span>
      </nav>

      <!-- Main Product Details Section -->
      <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 36px; margin-bottom: 56px;" class="product-detail-grid">
        <!-- Gallery Column -->
        <div>
          <div style="position: relative; width: 100%; padding-top: 100%; border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-subtle); border: 1px solid var(--border-color); margin-bottom: 14px;">
            <img id="main-product-img" src="${images[0]}" alt="${escapeHTML(product.name)}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; cursor: zoom-in;" />
          </div>
          
          ${images.length > 1 ? `
            <div style="display: flex; gap: 10px; overflow-x: auto;">
              ${images.map((img, idx) => `
                <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="width: 70px; height: 70px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-color)'}; flex-shrink: 0; padding: 0;">
                  <img src="${img}" style="width:100%; height:100%; object-fit: cover;" />
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Details Column -->
        <div style="display: flex; flex-direction: column;">
          <h1 style="font-size: 2rem; margin-bottom: 12px; line-height: 1.25;">${escapeHTML(product.name)}</h1>
          
          <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
            <span style="font-size: 2rem; font-weight: 700; color: var(--primary);">${formatCurrency(product.price)}</span>
            ${product.old_price ? `<span style="font-size: 1.2rem; color: var(--text-muted); text-decoration: line-through;">${formatCurrency(product.old_price)}</span>` : ''}
            ${product.stock > 0 ? `<span class="badge" style="position: static; background: var(--success); color: #FFF;">In Stock (${product.stock} sets left)</span>` : `<span class="badge badge-out" style="position: static;">Sold Out</span>`}
          </div>

          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
            ${escapeHTML(product.description)}
          </p>

          <!-- Size Selector -->
          ${product.sizes && product.sizes.length ? `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="font-weight: 600; font-size: 0.95rem;">Select Bangle Size:</label>
                <a href="#size-guide" style="font-size: 0.85rem; color: var(--primary); text-decoration: underline;">📏 Size Guide</a>
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${product.sizes.map(sz => `
                  <button class="btn ${sz === selectedSize ? 'btn-primary' : 'btn-secondary'} btn-sm size-opt-btn" data-size="${sz}">
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Color Selector -->
          ${product.colors && product.colors.length ? `
            <div style="margin-bottom: 24px;">
              <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 8px;">Color Variant:</label>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${product.colors.map(col => `
                  <button class="btn ${col === selectedColor ? 'btn-primary' : 'btn-secondary'} btn-sm color-opt-btn" data-color="${col}">
                    ${col}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity Controls & Add to Cart -->
          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 24px; align-items: center;">
            <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
              <button id="qty-minus" style="padding: 10px 16px; font-weight: bold; font-size: 1.2rem;">-</button>
              <span id="qty-display" style="padding: 0 16px; font-weight: 700; min-width: 40px; text-align: center;">1</span>
              <button id="qty-plus" style="padding: 10px 16px; font-weight: bold; font-size: 1.2rem;">+</button>
            </div>

            <button id="add-to-cart-btn" class="btn btn-primary btn-lg" style="flex-grow: 1;">
              🛒 ${t('add_to_cart')}
            </button>
            
            <button id="buy-now-btn" class="btn btn-accent btn-lg" style="flex-grow: 1;">
              ⚡ ${t('buy_now')}
            </button>
          </div>

          <!-- Social Share Buttons -->
          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 16px;">
            <span>Share:</span>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="min-height:36px;">
              Facebook
            </a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on Noor's: ` + window.location.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="min-height:36px;">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <section style="border-top: 1px solid var(--border-color); padding-top: 48px; margin-bottom: 56px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.75rem;">${t('customer_reviews')}</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Real customer feedback & ratings</p>
          </div>
          <button id="open-review-form-btn" class="btn btn-secondary">${t('write_review')}</button>
        </div>

        <!-- Add Review Form (Hidden by default) -->
        <div id="review-form-wrapper" style="display: none; background: var(--bg-surface); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 32px;">
          <h3 style="margin-bottom: 16px;">Leave a Rating & Review</h3>
          <form id="add-review-form">
            <!-- Honeypot -->
            <input type="text" name="website_url_hp" style="display:none;" tabindex="-1" autocomplete="off" />

            <div class="form-group">
              <label class="form-label">${t('customer_name')} *</label>
              <input type="text" id="rev-name" class="form-control" required placeholder="e.g. Anika Rahman" />
            </div>

            <div class="form-group">
              <label class="form-label">${t('rating')} *</label>
              <select id="rev-rating" class="form-control" required>
                <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 Very Good)</option>
                <option value="3">⭐⭐⭐ (3/5 Average)</option>
                <option value="2">⭐⭐ (2/5 Below Average)</option>
                <option value="1">⭐ (1/5 Poor)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Your Review / Comments *</label>
              <textarea id="rev-comment" class="form-control" rows="3" required placeholder="Write your experience with this bangle set..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary">${t('submit_review')}</button>
          </form>
        </div>

        <!-- Reviews List -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${reviews.length === 0 ? `
            <p style="color: var(--text-muted); font-style: italic;">No reviews yet. Be the first to review this product!</p>
          ` : reviews.map(r => `
            <div style="background: var(--bg-surface); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong style="font-size: 1rem;">${escapeHTML(r.customer_name)}</strong>
                <span style="color: var(--accent); font-size: 1.1rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style="color: var(--text-main); font-size: 0.95rem;">${escapeHTML(r.comment)}</p>
              <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 8px;">${new Date(r.created_at).toLocaleDateString()}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Related Products -->
      ${filteredRelated.length > 0 ? `
        <section style="border-top: 1px solid var(--border-color); padding-top: 48px;">
          <h2 style="font-size: 1.75rem; margin-bottom: 24px;">${t('related_products')}</h2>
          <div class="grid grid-cols-4">
            ${filteredRelated.map(p => renderProductCardHTML(p)).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;

  // Attach gallery thumbnail click listeners
  container.querySelectorAll('.thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.thumb-btn').forEach(b => b.style.borderColor = 'var(--border-color)');
      btn.style.borderColor = 'var(--primary)';
      const idx = parseInt(btn.getAttribute('data-idx'));
      const mainImg = container.querySelector('#main-product-img');
      if (mainImg) mainImg.src = images[idx];
    });
  });

  // Size option button click listeners
  container.querySelectorAll('.size-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-opt-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      selectedSize = btn.getAttribute('data-size');
    });
  });

  // Color option button click listeners
  container.querySelectorAll('.color-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.color-opt-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      selectedColor = btn.getAttribute('data-color');
    });
  });

  // Quantity button listeners
  const qtyDisplay = container.querySelector('#qty-display');
  container.querySelector('#qty-minus').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      if (qtyDisplay) qtyDisplay.textContent = quantity;
    }
  });
  container.querySelector('#qty-plus').addEventListener('click', () => {
    quantity++;
    if (qtyDisplay) qtyDisplay.textContent = quantity;
  });

  // Add to Cart
  container.querySelector('#add-to-cart-btn').addEventListener('click', () => {
    store.addToCart(product, quantity, selectedSize, selectedColor);
    showToast(`${product.name} added to cart!`, 'success');
  });

  // Buy Now (Adds to cart & redirects directly to checkout)
  container.querySelector('#buy-now-btn').addEventListener('click', () => {
    store.addToCart(product, quantity, selectedSize, selectedColor);
    window.location.hash = '#checkout';
  });

  // Review form toggle & submit
  const revToggleBtn = container.querySelector('#open-review-form-btn');
  const revWrapper = container.querySelector('#review-form-wrapper');
  if (revToggleBtn && revWrapper) {
    revToggleBtn.addEventListener('click', () => {
      revWrapper.style.display = revWrapper.style.display === 'none' ? 'block' : 'none';
    });
  }

  const revForm = container.querySelector('#add-review-form');
  if (revForm) {
    revForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateFormSpamProtection(revForm, 10)) return;

      const name = container.querySelector('#rev-name').value.trim();
      const rating = parseInt(container.querySelector('#rev-rating').value);
      const comment = container.querySelector('#rev-comment').value.trim();

      await DataService.addReview({
        product_id: product.id,
        customer_name: name,
        rating: rating,
        comment: comment
      });

      showToast(t('review_success'), 'success');
      revForm.reset();
      revWrapper.style.display = 'none';
    });
  }

  if (filteredRelated.length > 0) {
    attachProductCardEvents(container);
  }
}
