const CACHE = 'cm-v24';

self.addEventListener('install', e => {
  // index.html'i asla pre-cache'leme — her zaman network'ten al
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Tüm eski cache'leri sil
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.includes('/cekim-takip')) return;

  e.respondWith(
    // cache: 'no-cache' → GitHub Pages CDN'ini bypass et, her seferinde taze al
    fetch(e.request, { cache: 'no-cache' })
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request)) // sadece offline'da cache'e bak
  );
});
