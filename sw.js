// 오프라인 지원: 사이트 파일을 캐시해 두고, 캐시에 있으면 바로 쓰고 없으면 네트워크에서 받는다.
// 파일을 바꾸면 VERSION 값을 올려야 사용자 기기에서 새 버전으로 교체된다.
const VERSION='v31';
const FILES = ['./', './index.html', './data.js', './alt.js', './eco.js', './chess.js', './stockfish.js', './sf19.js', './sf19.wasm',
               './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 공유 링크에 붙는 ?utm=… 같은 꼬리는 무시하고, 페이지 열기 요청은 오프라인이어도 index.html로 답한다
  e.respondWith(caches.match(e.request, {ignoreSearch: true})
    .then(r => r || fetch(e.request).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
