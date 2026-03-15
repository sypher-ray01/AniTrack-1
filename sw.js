const CACHE_NAME = 'anitrack-v2.2-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/list.html',
  '/search.html',
  '/detail.html',
  '/character.html',
  '/seasonal.html',
  '/clubs.html',
  '/club-detail.html',
  '/analytics.html',
  '/admin.html',
  '/profile.html',
  '/help.html',
  '/404.html',
  '/css/variables.css',
  '/css/reset.css',
  '/css/layout.css',
  '/css/navbar.css',
  '/css/modal.css',
  '/css/toast.css',
  '/css/skeleton.css',
  '/css/badges.css',
  '/css/themes.css',
  '/js/storage.js',
  '/js/auth.js',
  '/js/api.js',
  '/js/ui.js',
  '/js/theme.js',
  '/js/navbar.js',
  '/js/shortcuts.js',
  '/js/pwa.js',
  '/js/app.js',
  '/js/watchlist.js',
  '/js/progress.js',
  '/js/search.js',
  '/js/detail.js',
  '/js/character.js',
  '/js/seasonal.js',
  '/js/clubs.js',
  '/js/polls.js',
  '/js/reviews.js',
  '/js/analytics.js',
  '/js/admin.js',
  '/js/profile.js',
  '/js/recommendations.js',
  '/js/reminders.js',
  '/js/share.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Exclude API calls from strong caching, use network first for Jikan
  if (event.request.url.includes('api.jikan.moe')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
