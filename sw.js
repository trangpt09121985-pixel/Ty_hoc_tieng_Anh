// Lưu bản sao trang trên máy để con chơi được cả khi mất mạng.
// Có mạng: luôn tải bản mới nhất từ GitHub (không dùng bản cũ trong bộ nhớ đệm).
const CACHE = 'ty-hoc-tieng-anh-v7';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const same = url.origin === location.origin;
  const req = same ? new Request(e.request, {cache: 'no-store'}) : e.request;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && same) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html')))
  );
});
