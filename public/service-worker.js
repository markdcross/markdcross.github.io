const FILES_TO_CACHE = [
  '/',
  // '/portfolio',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/img/burger.png',
  '/img/gitjobs.png',
  '/img/headshot.png',
  '/img/hero.jpg',
  '/img/logo.png',
  '/img/notetaker.png',
  '/img/perspektiv.png',
  '/js/scripts.js',
  '/css/styles.css',
  '/css/bootstrap.min.css',
  '../views/pages/index.ejs',
  '../views/pages/portfolio.ejs'
  // '../views/pages/partials/bio.ejs',
  // '../views/pages/partials/brewing.ejs',
  // '../views/pages/partials/ctcLinks.ejs',
  // '../views/pages/partials/footer.ejs',
  // '../views/pages/partials/head.ejs',
  // '../views/pages/partials/header.ejs',
  // '../views/pages/partials/landing.ejs',
  // '../views/pages/partials/modal.ejs',
  // '../views/pages/partials/pills.ejs',
  // '../views/pages/partials/projects.ejs',
  // '../views/pages/partials/stack.ejs'
];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// install
self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener('fetch', function (evt) {
  // cache successful requests to the API
  if (evt.request.url.includes('/api/')) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );

    return;
  }

  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});
