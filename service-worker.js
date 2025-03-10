const CACHE_NAME = 'samoussa-runner-v1';
const ASSETS = [
  './',
  './index.html',
  './assets/samoussa_run1.png',
  './assets/samoussa_run2.png',
  './assets/samoussa_crash.png',
  './assets/couteau.png',
  './assets/marmite.png',
  './assets/main.png',
  './assets/piment.png',
  './assets/epice.png',
  './assets/biere_dodo.png',
  './assets/ww.png',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache: Network First avec fallback sur le cache
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes vers des CDN externes (sauf celle explicitement mise en cache)
  if (event.request.url.startsWith('https://') && 
      !event.request.url.includes('cdn.jsdelivr.net/npm/qrcode-generator')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la réponse est valide, on la met en cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec de la requête réseau, on utilise le cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si l'asset n'est pas dans le cache, on renvoie une page d'erreur
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});