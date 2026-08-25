const CACHE_NAME = 'azkar-app-v1';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/prayer.js',
  './js/quran.js',
  './js/tasbih.js',
  './js/azkar.js',
  './js/notifications.js',
  './js/data-azkar.js',
  './js/data-hadith.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png'
];

self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for app shell, network-first for API calls (prayer times / quran text)
self.addEventListener('fetch', (event)=>{
  const url = event.request.url;
  const isAPI = url.includes('api.aladhan.com') || url.includes('api.alquran.cloud') || url.includes('nominatim.openstreetmap.org');

  if(isAPI){
    event.respondWith(
      fetch(event.request).catch(()=> caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

self.addEventListener('notificationclick', (event)=>{
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type:'window'}).then(clientsArr=>{
      if(clientsArr.length > 0) return clientsArr[0].focus();
      return self.clients.openWindow('./index.html');
    })
  );
});
