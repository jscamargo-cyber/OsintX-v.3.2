const CACHE_NAME = 'brujula-osint-v2.1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/data.js',
    '/img/favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
