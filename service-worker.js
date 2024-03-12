const cacheName = "v1";

async function impl(e) {
	if (!e.request.url.includes("?ts="))
		return await fetch(e.request);
	else {
		let cache = await caches.open(cacheName);
		let cacheResponse = await cache.match(e.request);
		if (cacheResponse)
			return cacheResponse;
		else {
			// // delete old cached versions
			// let keys = await cache.keys(e.request, { ignoreSearch: true });
			// for (let k of keys)
			// 	if (k.url !== e.request.url) {
			// 		cache.delete(k);
			// 		console.log("deleted from cache: " + k.url);
			// 	}
			let networkResponse = await fetch(e.request);
			cache.put(e.request, networkResponse.clone());
			return networkResponse;
		}
	}
}

self.addEventListener("fetch", e => e.respondWith(impl(e)));

self.addEventListener("push", e => {
	const payload = e.data?.text() ?? "no payload";
	e.waitUntil(
		self.registration.showNotification("webSCADA Notification", {
			body: payload,
		}),
	);
});