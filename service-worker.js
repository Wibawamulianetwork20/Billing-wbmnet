const CACHE_NAME = "wbm-net-v2";

/* FILE STATIC */
const staticAssets = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/pelanggan.html",
  "/laporan.html",
  "/settings.html",
  "/firebase.js",
  "/dashboard.js",
  "/pelanggan.js",
  "/laporan.js",
  "/settings.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

/* INSTALL */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(staticAssets))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

/* FETCH (HYBRID STRATEGY) */
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ❌ JANGAN CACHE FIREBASE
  if (
    url.includes("firestore") ||
    url.includes("googleapis") ||
    url.includes("firebase")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ✔ NETWORK FIRST (biar tidak offline terus)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, res.clone());
          return res;
        });
      })
      .catch(() => caches.match(event.request))
  );
});