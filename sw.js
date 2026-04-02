const CACHE_NAME = "PWA-v1"
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-128.png",
    "./icon-180.png",
    "./icon-192.png",
    "./icon-512.png",
    "./assets/exceljs.min.js",
    "./assets/html5-qrcode.min.js",
    "./assets/Sortable.min.js",
    "./assets/tailwindcss.js",
    "./assets/vconsole.min.js",
    "./assets/vue.global.js",
]

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)))
    self.skipWaiting()
})
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))).then(() => self.clients.claim())))
self.addEventListener("fetch", event => event.respondWith(caches.match(event.request).then(response => response || fetch(event.request))))
