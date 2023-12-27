const cacheName = 'phaser';
var filesToCache = [
    '/',
    '/index.html',
    '/assets/StartScreen.png',
    'src/main.ts',
    'src/HelloWorldScene.ts',
    'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.55.2/dist/phaser.min.js'
];

self.addEventListener('install', function(event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function(err) {
      console.log(err);
    })
  );
});