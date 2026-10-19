/* Çayxana — service worker. Versiya version.js faylındadır, bu faylı dəyişməyə ehtiyac yoxdur. */
importScripts('version.js');
var CACHE = 'cayxana-' + self.APP_VERSION;
var FONT_CACHE = 'cayxana-fonts';
var APP_FILES = [
  './', 'index.html', 'version.js', 'manifest.webmanifest', 'css/style.css', 'js/game.js', 'js/pwa.js', 'js/cloud.js', 'vendor/three.min.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icons/favicon-64.png',
  'firebase-config.js', 'vendor/firebase/firebase-app-compat.js', 'vendor/firebase/firebase-auth-compat.js', 'vendor/firebase/firebase-firestore-compat.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(APP_FILES.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('cayxana-') === 0 && k !== CACHE && k !== FONT_CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data.type === 'GET_VERSION' && e.ports && e.ports[0]) e.ports[0].postMessage(self.APP_VERSION);
});

self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Google Fonts: köhnəni dərhal ver, arxa planda yenilə
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Firebase girişi (/__/auth/...) həmişə şəbəkədən
  if (url.pathname.indexOf('/__/') === 0) return;
  // version.js həmişə şəbəkədən yoxlanır ki, oyunda göstərilən versiya düz olsun
  if (url.pathname.endsWith('/version.js') || url.pathname.endsWith('/firebase-config.js')) {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(function () { return caches.match(req); }));
    return;
  }
  // Oyunun səhifəsi: keşdən, internet olmasa da açılsın
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('index.html').then(function (hit) { return hit || fetch(req); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  }));
});
