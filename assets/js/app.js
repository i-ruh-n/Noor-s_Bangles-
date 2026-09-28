/**
 * Noor's Handmade Bangles - Main SPA Application Controller
 */

import { CONFIG } from './config.js';
import { initSupabaseClient } from './supabaseClient.js';
import { store } from './store.js';
import { t } from './i18n.js';
import { renderHomeView } from './views/home.js';
import { renderShopView } from './views/shop.js';
import { renderProductDetailView } from './views/productDetail.js';
import { renderCartView } from './views/cart.js';
import { renderCheckoutView } from './views/checkout.js';
import { renderTrackView } from './views/track.js';
import { renderCustomOrderView } from './views/customOrder.js';
import { renderAboutView, renderContactView, renderFAQView, renderSizeGuideView, renderPolicyView } from './views/infoPages.js';
import { renderAdminView } from './views/admin.js';

// Parse URL Hash & Parameters (e.g. #product?id=123 -> view: 'product', params: { id: '123' })
function parseHashRoute() {
  const rawHash = window.location.hash.slice(1) || 'home';
  const [viewPart, queryPart] = rawHash.split('?');
  const params = {};

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, val] of searchParams.entries()) {
      params[key] = val;
    }
  }

  return { view: viewPart || 'home', params };
}

// Global View Switcher Router
async function routeApp() {
  const { view, params } = parseHashRoute();
  const mount = document.getElementById('app-mount');
  if (!mount) return;

  // Scroll to top on view change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active state on nav links
  document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(el => {
    const targetHash = el.getAttribute('href') ? el.getAttribute('href').slice(1).split('?')[0] : '';
    if (targetHash === view) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  try {
    switch (view) {
      case 'home':
        await renderHomeView(mount);
        break;
      case 'shop':
        await renderShopView(mount, params);
        break;
      case 'product':
        await renderProductDetailView(mount, params);
        break;
      case 'cart':
        renderCartView(mount);
        break;
      case 'checkout':
        renderCheckoutView(mount);
        break;
      case 'track':
        renderTrackView(mount, params);
        break;
      case 'custom-order':
        renderCustomOrderView(mount);
        break;
      case 'about':
        renderAboutView(mount);
        break;
      case 'contact':
        renderContactView(mount);
        break;
      case 'faq':
        renderFAQView(mount);
        break;
      case 'size-guide':
        renderSizeGuideView(mount);
        break;
      case 'policy':
        renderPolicyView(mount);
        break;
      case 'admin':
        await renderAdminView(mount);
        break;
      default:
        await renderHomeView(mount);
    }
  } catch (err) {
    console.error("Router error:", err);
    mount.innerHTML = `<div class="container" style="padding: 60px; text-align: center;"><h2>Error loading page</h2><p>${err.message}</p></div>`;
  }
}

// Update UI elements dependent on state
function updateUIFromStore() {
  // Update Cart Count Badges
  const count = store.getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });

  // Update Language Button Text
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.textContent = store.lang === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 EN';
  }

  // Update i18n Translatable Strings in Shell Header/Footer
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
}

// App Initialization Entrypoint
document.addEventListener('DOMContentLoaded', async () => {
  // Init Supabase Client
  await initSupabaseClient();

  // Load Saved Theme
  const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Theme Toggle Listener
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem(CONFIG.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    });
  }

  // Language Toggle Listener
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      store.toggleLanguage();
      routeApp(); // Re-render current view with new language dictionary
    });
  }

  // Register Hash Change Listener
  window.addEventListener('hashchange', routeApp);

  // Subscribe to Store Changes
  store.subscribe(updateUIFromStore);

  // Initial UI & Route render
  updateUIFromStore();
  routeApp();

  // Service Worker Registration for PWA Admin support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration skipped in local file mode:', err));
  }
});
