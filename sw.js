let VERSION = "v4";
// The name of the cache
let APP_CACHE_NAME = `aviator-${VERSION}`;

// The version of the cache.
// The static resources that the app needs to function.
const APP_STATIC_RESOURCES = [
  "/app/app.css",
  "/app/app.html",
  "/app/app.js",

  "/app/card.css",
  "/app/checkbox.css",
  "/app/crash.png",

  "/app/dialogs.css",
  "/app/AviaBust.apk",
  "/app/logo.png",
  //pd.json should hit the network
  "/app/terms.html",
  "/app/aviator/chart.js",
  "/app/aviator/aviator.js",

  "/material-icons.css",
  "/icons.woff2",
  "/assets/icon.png",
  "/assets/close-dialog.png",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      console.log("app install");
      const cache = await caches.open(APP_CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== APP_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(APP_CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }

      const response = await fetch(event.request);

      /* if (!response || response.status !== 200 || response.type !== "basic") {
        return response;
      }

      let ENABLE_DYNAMIC_CACHING = true;

      if (ENABLE_DYNAMIC_CACHING) {
        const responseToCache = response.clone();
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(event.request, response.clone());
      } */

      return response;
    })()
  );
});
