const CACHE_STATIC = "static-v1"
const CACHE_RUNTIME = "runtime-v1"

const ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/images/apple-splash-1260-2736.png",
    "/images/apple-splash-1620-2160.png",
    "/images/manifest-icon-512.maskable.png",
    "/images/apple-splash-1284-2778.png",
    "/images/manifest-icon-192.maskable.png",
    "/images/apple-splash-1206-2622.png",
    "/images/apple-icon-180.png",
    "/images/apple-splash-1125-2436.png",
    "/images/apple-splash-1170-2532.png",
    "/images/apple-splash-1536-2048.png",
    "/images/apple-splash-750-1334.png",
    "/images/apple-splash-1242-2208.png",
    "/images/apple-splash-2048-2732.png",
    "/images/apple-splash-1668-2388.png",
    "/images/apple-splash-1290-2796.png",
    "/images/apple-splash-1640-2360.png",
    "/images/apple-splash-1320-2868.png",
    "/images/apple-splash-1179-2556.png",
    "/images/apple-splash-828-1792.png",
    "/images/apple-splash-1488-2266.png",
    "/images/apple-splash-1668-2224.png",
    "/images/apple-splash-640-1136.png",
    "/images/favicon-196.png",
    "/images/apple-splash-1242-2688.png",
    "/assets/exceljs.min.js",
    "/assets/html5-qrcode.min.js",
    "/assets/Sortable.min.js",
    "/assets/tailwindcss.js",
    "/assets/vconsole.min.js",
    "/assets/vue.global.js"
]


self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_STATIC).then(cache => cache.addAll(ASSETS))
    )
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => ![CACHE_STATIC, CACHE_RUNTIME].includes(k))
                    .map(k => caches.delete(k))
            )
        )
    )
    self.clients.claim()
})


self.addEventListener("fetch", event => {
    const req = event.request

    if (req.method !== "GET") return
    const url = new URL(req.url)
    if (url.origin !== location.origin) return

    if (req.headers.get("accept").includes("text/html")) {
        event.respondWith(networkFirst(req))
        return
    }

    if (
        req.destination === "script" ||
        req.destination === "style" ||
        req.destination === "image"
    ) {
        event.respondWith(staleWhileRevalidate(req))
        return
    }

    event.respondWith(cacheFirst(req))
})

async function cacheFirst(req) {
    const cache = await caches.open(CACHE_RUNTIME)
    const cached = await cache.match(req)

    if (cached) return cached

    const res = await fetch(req)
    cache.put(req, res.clone())

    return res
}

async function networkFirst(req) {
    const cache = await caches.open(CACHE_RUNTIME)

    try {
        const res = await fetch(req)
        cache.put(req, res.clone())
        return res
    } catch {
        const cached = await cache.match(req)
        return cached || caches.match("/index.html")
    }
}

async function staleWhileRevalidate(req) {
    const cache = await caches.open(CACHE_RUNTIME)
    const cached = await cache.match(req)

    const networkFetch = fetch(req).then(res => {
        cache.put(req, res.clone())
        return res
    })
    return cached || networkFetch
}