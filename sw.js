let staticCacheName = 'restaurant-cache-1';

let urlToCache = [
    '/',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',

];

// install the service worker and add the files to the cache
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(urlToCache);

        // add a catch in case there's an error
        }).catch(error => {
            console.log(`There's a problem! ${error}`);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Respond from the cache when needed; otherwise, fetch from server
// Check if request origin is same as current origin to intercept route requests for same origin only

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (resp) {
      return resp || fetch(event.request)
    .then(function (response) {
      return caches.open('v1').then(function (cache) {
        cache.put(event.request, response.clone());
        return response;
        });
      });
    })
  );
});
