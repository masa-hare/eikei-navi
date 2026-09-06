const CACHE_NAME = 'eikei-navi-v37';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('eikei-navi-v') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);
  if(url.origin !== self.location.origin) return;

  if(request.mode === 'navigate'){
    const appUrl=new URL(APP_SHELL[0],self.location.href);
    const directoryUrl=new URL('./',self.location.href);
    if(url.pathname!==appUrl.pathname && url.pathname!==directoryUrl.pathname)return;
    const update = fetch(request).then(response => {
      if(response.ok){
        const copy = response.clone();
        return caches.open(CACHE_NAME).then(cache => {
          return cache.put('./index.html', copy).then(() => response);
        });
      }
      return response;
    });

    event.waitUntil(update.then(() => undefined).catch(() => undefined));
    event.respondWith(
      caches.match('./index.html')
        .then(cached => cached || update)
    );
    return;
  }

  if(url.search || !APP_SHELL.some(file => new URL(file,self.location.href).pathname===url.pathname))return;
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if(response.ok){
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
