/**
 * Noor's Handmade Bangles - Service Worker for Offline PWA Support
 */

const CACHE_NAME = 'noors-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/config.js',
  './assets/js/i18n.js',
  './assets/js/store.js',
  './assets/js/utils.js',
  './assets/js/supabaseClient.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
