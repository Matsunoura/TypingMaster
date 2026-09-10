const cacheName = "DefaultCompany-TypingMaster-0.1.1";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/Build.framework.js",
    "Build/Build.data",
    "Build/Build.wasm",
    "TemplateData/style.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    // http または https 以外のリクエスト（chrome-extension等）はキャッシュ処理をスルーする
    if (!e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      
      // レスポンスが正常でない場合や http(s) 以外の場合はキャッシュしない
      if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
      }

      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});