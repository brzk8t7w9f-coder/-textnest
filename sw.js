const CACHE='textnest-v2';
const FILES=['./','index.html','styles.css','app.js','manifest.json','icon-192.png','icon-512.png','tones/nest-bell.wav','tones/soft-chime.wav','tones/happy-pop.wav','tones/classic-ring.wav'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
