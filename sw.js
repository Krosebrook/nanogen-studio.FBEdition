const CACHE_NAME = 'nanogen-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dancing+Script:wght@400..700&family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@400;500;700;900&family=Outfit:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache with fresh version
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for image placeholders if offline
        if (event.request.url.includes('placehold.co')) {
          return caches.match('/'); 
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});