const CACHE_NAME = "PWA-v1"
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
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
    self.skipWaiting()
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS)
        })
    )
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            )
        }).then(() => self.clients.claim())
    )
})


self.addEventListener("fetch", event => {
    // 判断用户是否触发了浏览器的“手动刷新” (下拉刷新或F5)
    const isManualRefresh = event.request.cache === "reload" || event.request.cache === "no-cache"

    if (isManualRefresh) {
        // event.respondWith(
        //     fetch(event.request).then(networkResponse => {
        //         if (networkResponse && networkResponse.status === 200) {
        //             const responseClone = networkResponse.clone()
        //             caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
        //         }
        //         return networkResponse
        //     }).catch(() => caches.match(event.request))
        // )
    } else {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse
                }
                return fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
                        const responseClone = networkResponse.clone()
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
                    }
                    return networkResponse
                }).catch(() => {
                    // 完全断网且无缓存时的容错处理
                })
            })
        )
    }
})