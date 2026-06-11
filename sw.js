// ML Trading PWA service worker
const CACHE = 'mltrading-v1';
const ASSETS = [
  '/reseller.html',
  '/shipping.html',
  '/manifest-reseller.json',
  '/manifest-shipping.json',
  '/icon-192.png',
  '/icon-512.png',
  '/logo-wordmark.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin && !url.pathname.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy).catch(() => {}));
        return r;
      }).catch(() => caches.match(e.request))
    );
  }
});
