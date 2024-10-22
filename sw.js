const cacheName = 'app-cache-v2';
const assetsToCache = [
  '/DiceRoller/',
  '/DiceRoller/index.html',
  '/DiceRoller/script.js',
  '/DiceRoller/modalScript.js',
  '/DiceRoller/competenza.js',
  '/DiceRoller/sound/diceRoll.mp3',
  '/DiceRoller/sound/fail.mp3',
  '/DiceRoller/sound/secret.mp3',
  '/DiceRoller/sound/success.mp3',
  '/DiceRoller/favicon.svg',
  '/DiceRoller/diceIcon.svg'
];

// Installazione: Cache delle risorse iniziali
self.addEventListener('install', event => {
  console.log('[Service Worker] Install: caching resources');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log(`[Service Worker] Caching assets: ${assetsToCache}`);
        return cache.addAll(assetsToCache);
      })
      .then(() => {
        console.log('[Service Worker] All assets have been cached');
      })
      .catch(err => {
        console.error('[Service Worker] Caching failed', err);
      })
  );
});

// Attivazione: Pulisce le vecchie cache se la versione della cache è cambiata
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate: checking for old caches');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log(`[Service Worker] Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] New cache activated');
    })
    .catch(err => {
      console.error('[Service Worker] Cache activation failed', err);
    })
  );
});

// Intercettazione delle richieste con Stale-While-Revalidate
self.addEventListener('fetch', event => {
  console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
        
        // Effettua una richiesta in background per aggiornare la cache
        event.waitUntil(
          fetch(event.request).then(networkResponse => {
            console.log(`[Service Worker] Updating cache with latest resource: ${event.request.url}`);
            caches.open(cacheName).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }).catch(err => {
            console.error(`[Service Worker] Fetch in background failed for: ${event.request.url}`, err);
          })
        );
        return cachedResponse;
      }

      // Se la risorsa non è in cache, effettua una normale richiesta di rete
      console.log(`[Service Worker] Resource not in cache, fetching from network: ${event.request.url}`);
      return fetch(event.request).then(networkResponse => {
        return caches.open(cacheName).then(cache => {
          console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(err => {
        console.error(`[Service Worker] Fetch failed for: ${event.request.url}`, err);
      });
    })
  );
});
