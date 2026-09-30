/* POS Seblak — service worker: offline-first */
const CACHE='pos-seblak-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
      const cp=res.clone();
      if(res.ok&&new URL(e.request.url).origin===self.location.origin)caches.open(CACHE).then(c=>c.put(e.request,cp));
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
