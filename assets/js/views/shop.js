/**
 * Noor's Handmade Bangles - Shop View Generator
 */

import { t } from '../i18n.js';
import { DataService } from '../supabaseClient.js';
import { formatCurrency, escapeHTML } from '../utils.js';
import { store } from '../store.js';
import { renderProductCardHTML, attachProductCardEvents } from './home.js';

export async function renderShopView(container, params = {}) {
  const categories = await DataService.getCategories();
  let allProducts = await DataService.getProducts();

  let activeCategory = params.category || 'all';
  let searchQuery = params.search || '';
  let activeSort = 'newest';
  let priceMax = 3000;
  let selectedSizes = [];

  function applyFiltersAndRender() {
    let filtered = [...allProducts];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.colors && p.colors.some(c => c.toLowerCase().includes(q))) ||
        (p.materials && p.materials.some(m => m.toLowerCase().includes(q)))
      );
    }

    filtered = filtered.filter(p => p.price <= priceMax);

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Sort
    if (activeSort === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'discount') {
      filtered.sort((a, b) => {
        const discA = a.old_price ? (a.old_price - a.price) : 0;
        const discB = b.old_price ? (b.old_price - b.price) : 0;
        return discB - discA;
      });
    }

    const gridEl = container.querySelector('#shop-product-grid');
    const countEl = container.querySelector('#product-count');
    if (countEl) countEl.textContent = `Showing ${filtered.length} products`;

    if (gridEl) {
      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--text-muted);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
            <h3>No products found matching your search or filter criteria.</h3>
            <button class="btn btn-secondary" id="reset-filters-btn" style="margin-top: 16px;">Reset All Filters</button>
          </div>
        `;
        const resetBtn = gridEl.querySelector('#reset-filters-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            activeCategory = 'all';
            searchQuery = '';
            priceMax = 3000;
            selectedSizes = [];
            renderShopView(container);
          });
        }
      } else {
        gridEl.innerHTML = filtered.map(product => renderProductCardHTML(product)).join('');
        attachProductCardEvents(gridEl);
      }
    }
  }

  container.innerHTML = `
    <div class="container" style="padding: 32px 16px;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="font-size: 2.2rem; margin-bottom: 8px;">${t('all_products')}</h1>
        <p style="color: var(--text-muted);">Discover handcrafted bangles in vibrant colors and luxurious designs</p>
      </div>

      <!-- Search Bar & Filters Header -->
      <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; align-items: center; justify-content: space-between;">
        <div style="position: relative; flex-grow: 1; max-width: 450px;">
          <input type="text" id="shop-search-input" class="form-control" placeholder="${t('search_placeholder')}" value="${escapeHTML(searchQuery)}" style="padding-left: 38px;">
          <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <label style="font-weight: 600; font-size: 0.9rem;">${t('sort_by')}:</label>
          <select id="shop-sort-select" class="form-control" style="width: auto;">
            <option value="newest">${t('sort_newest')}</option>
            <option value="price_low">${t('sort_price_low')}</option>
            <option value="price_high">${t('sort_price_high')}</option>
            <option value="discount">${t('sort_discount')}</option>
          </select>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-color);">
        <button class="btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm shop-cat-tab" data-cat="all">
          All
        </button>
        ${categories.map(c => `
          <button class="btn ${activeCategory === c.id ? 'btn-primary' : 'btn-secondary'} btn-sm shop-cat-tab" data-cat="${c.id}">
            ${escapeHTML(c.name)}
          </button>
        `).join('')}
      </div>

      <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 24px;">
        <div>
          <div id="product-count" style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;"></div>
          <div id="shop-product-grid" class="grid grid-cols-4"></div>
        </div>
      </div>
    </div>
  `;

  // Attach search input listener
  const searchInput = container.querySelector('#shop-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Attach sort dropdown listener
  const sortSelect = container.querySelector('#shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Category tab listeners
  container.querySelectorAll('.shop-cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.shop-cat-tab').forEach(tabEl => {
        tabEl.classList.remove('btn-primary');
        tabEl.classList.add('btn-secondary');
      });
      tab.classList.remove('btn-secondary');
      tab.classList.add('btn-primary');
      activeCategory = tab.getAttribute('data-cat');
      applyFiltersAndRender();
    });
  });

  applyFiltersAndRender();
}
