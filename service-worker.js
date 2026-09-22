// ==========================================
// ProToolsHub - Service Worker (Offline)
// ==========================================

const CACHE_NAME = 'protoolshub-v1';

const urlsToCache = [
  './',
  './index.html',
  './bmi-calculator.html',
  './age-calculator.html',
  './image-compressor.html',
  './word-counter.html',
  './qr-generator.html',
  './password-generator.html',
  './color-picker.html',
  './text-case-converter.html',
  './style.css?v=12',
  './tool.css?v=12',
  './script.js',
  './bmi-calculator.js',
  './age-calculator.js',
  './image-compressor.js',
  './word-counter.js',
  './qr-generator.js',
  './password-generator.js',
  './color-picker.js',
  './text-case-converter.js',
  './images/1hero.png',
  './images/2hero.png',
  './images/3hero.png',
  './images/4hero.png',
  './images/5hero.png',
  './images/6hero.png',
  './images/7hero.png',
  './images/8hero.png',
  './images/9hero.png',
  './images/10hero.png',
  './images/11hero.png',
  './images/12hero.png'
];

// ===== INSTALL =====
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('✅ Cache opened');
      return cache.addAll(urlsToCache).catch(function(err) {
        console.log('⚠️ Some files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ===== FETCH =====
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function() {
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});