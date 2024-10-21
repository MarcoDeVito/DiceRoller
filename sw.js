const cacheName = 'app-cache-v1';
const assetsToCache = [
  '/DiceRoller/',
  '/',
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
