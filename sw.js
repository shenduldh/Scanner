const CACHE_NAME = "PWA-v1"
const ASSETS = [
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-192.png",
    "sw.js",
]

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)))
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    caches.keys().then(cacheNames => Promise.all(cacheNames.map((cache) => { if (cache !== CACHE_NAME) return caches.delete(cache) })))
    event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)))
})