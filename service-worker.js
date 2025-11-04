// service-worker.js - muy básico: cachea los recursos esenciales
const CACHE_NAME = 'demo-cache-v1';
const urlsToCache = [
  '.',
  'index.html',
  'main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
