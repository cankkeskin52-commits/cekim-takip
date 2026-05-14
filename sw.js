const CACHE = 'cm-v19';
const CORE = ['/cekim-takip/', '/cekim-takip/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/cekim-takip/';
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
      for(const c of list){ if(c.url.includes('/cekim-takip/')&&'focus' in c) return c.focus(); }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.includes('/cekim-takip')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
