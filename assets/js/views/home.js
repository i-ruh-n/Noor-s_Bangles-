/**
 * Noor's Handmade Bangles - Home View Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML } from '../utils.js';
import { store } from '../store.js';

export async function renderHomeView(container) {
  const categories = await DataService.getCategories();
  const featuredProducts = await DataService.getProducts({ is_featured: true });
  const newArrivals = await DataService.getProducts({ is_new: true });

  container.innerHTML = `
    <!-- Hero Banner -->
    <section style="background: linear-gradient(135deg, var(--bg-subtle) 0%, var(--bg-main) 100%); padding: 48px 0; border-bottom: 1px solid var(--border-color); overflow: hidden;">
      <div class="container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
        <span class="badge badge-new" style="position: static; margin-bottom: 16px; font-size: 0.85rem; padding: 6px 16px;">NEW HANDMADE COLLECTION</span>
        <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); color: var(--text-main); max-width: 850px; margin-bottom: 16px; line-height: 1.15;">
          ${t('hero_title')}
        </h1>
        <p style="font-size: 1.1rem; color: var(--text-muted); max-width: 650px; margin-bottom: 28px;">
          ${t('hero_subtitle')}
        </p>
        <div style="display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;">
          <a href="#shop" class="btn btn-primary btn-lg">${t('shop_now')} →</a>
          <a href="#custom-order" class="btn btn-secondary btn-lg">${t('custom_request')}</a>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section style="padding: 48px 0;">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">${t('categories')}</span>
          <h2 class="section-title">Explore by Style</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;">
          ${categories.map(cat => `
            <a href="#shop?category=${cat.id}" class="product-card" style="padding: 20px; text-align: center; border-radius: var(--radius-md); transition: all 0.25s ease;">
              <div style="font-size: 2.2rem; margin-bottom: 10px;">✨</div>
              <h3 style="font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-main);">${escapeHTML(cat.name)}</h3>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Collection -->
    <section style="padding: 48px 0; background-color: var(--bg-surface);">
      <div class="container">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; text-align: left; gap: 16px;">
          <div>
            <span class="section-subtitle">${t('featured_products')}</span>
            <h2 class="section-title" style="margin-bottom: 0;">Handpicked Essentials</h2>
          </div>
          <a href="#shop" class="btn btn-secondary">${t('all_products')} →</a>
        </div>
        
        <div class="grid grid-cols-4">
          ${featuredProducts.slice(0, 4).map(product => renderProductCardHTML(product)).join('')}
        </div>
      </div>
    </section>

    <!-- New Arrivals Banner -->
    <section style="padding: 48px 0;">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">${t('new_arrivals')}</span>
          <h2 class="section-title">Fresh Off The Workbench</h2>
        </div>
        <div class="grid grid-cols-4">
          ${newArrivals.slice(0, 4).map(product => renderProductCardHTML(product)).join('')}
        </div>
      </div>
    </section>

    <!-- Trust Badges & Social Links -->
    <section style="padding: 40px 0; background-color: var(--primary-light); border-top: 1px solid var(--border-color);">
      <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; text-align: center;">
        <div>
          <div style="font-size: 2rem; margin-bottom: 8px;">🎨</div>
          <h4 style="font-weight: 700; margin-bottom: 4px;">100% Handcrafted</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Made by skilled artisans in Bangladesh</p>
        </div>
        <div>
          <div style="font-size: 2rem; margin-bottom: 8px;">🚚</div>
          <h4 style="font-weight: 700; margin-bottom: 4px;">Fast Home Delivery</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Dhaka ৳70 | Outside Dhaka ৳140</p>
        </div>
        <div>
          <div style="font-size: 2rem; margin-bottom: 8px;">💬</div>
          <h4 style="font-weight: 700; margin-bottom: 4px;">WhatsApp Order</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Instant response on +8801914-992749</p>
        </div>
      </div>
    </section>
  `;

  // Attach card event listeners
  attachProductCardEvents(container);
}

export function renderProductCardHTML(product) {
  const isWishlisted = store.isInWishlist(product.id);
  const mainImage = product.images && product.images.length ? product.images[0] : '';
  const discountPercent = product.old_price && product.old_price > product.price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : 0;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-img-wrapper">
        ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}%</span>` : product.is_new ? `<span class="badge badge-new">NEW</span>` : ''}
        <button class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}" title="Wishlist">
          ♥
        </button>
        <a href="#product?id=${product.id}">
          <img src="${mainImage}" alt="${escapeHTML(product.name)}" class="product-card-img" loading="lazy" />
        </a>
      </div>
      <div class="product-card-body">
        <a href="#product?id=${product.id}">
          <h3 class="product-title">${escapeHTML(product.name)}</h3>
        </a>
        <div class="product-price-row">
          <span class="price-current">${formatCurrency(product.price)}</span>
          ${product.old_price ? `<span class="price-old">${formatCurrency(product.old_price)}</span>` : ''}
        </div>
        <button class="btn btn-primary btn-sm quick-add-btn" data-add-id="${product.id}" style="margin-top: 12px; width: 100%;">
          ${t('add_to_cart')}
        </button>
      </div>
    </div>
  `;
}

export function attachProductCardEvents(container) {
  container.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const prodId = btn.getAttribute('data-add-id');
      const product = await DataService.getProductById(prodId);
      if (product) {
        store.addToCart(product, 1);
        import('../utils.js').then(m => m.showToast(`${product.name} added to cart!`, 'success'));
      }
    });
  });

  container.querySelectorAll('.wishlist-btn-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.getAttribute('data-wishlist-id');
      store.toggleWishlist(prodId);
      btn.classList.toggle('active');
    });
  });
}
