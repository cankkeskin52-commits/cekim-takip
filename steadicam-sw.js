// SW tamamen devre dışı — tüm cache temizlenir ve SW kendini siler
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => clients.matchAll({ type: 'window' }))
      .then(all => all.forEach(c => c.navigate(c.url)))
  );
});
