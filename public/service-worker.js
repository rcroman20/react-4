const CACHE_NAME = 'my-cache-v1';  // Versión del caché

// Archivos a almacenar en caché de manera inicial (opcional, si tienes recursos estáticos).
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/assets/logo.png',       // Ajusta según tu archivo de icono
];

// Durante la instalación del Service Worker, se almacenan los archivos en el caché.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching resources during installation');
      return cache.addAll(PRECACHE_URLS);  // Añadir archivos predeterminados al caché
    })
  );
  self.skipWaiting();  // Forzar que el nuevo SW se active inmediatamente
});

// Durante la activación del Service Worker, eliminamos los cachés antiguos.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);  // Eliminar cachés antiguos
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim());  // Toma el control de las páginas abiertas inmediatamente
});

// Durante las solicitudes de red, se maneja el caché y la actualización de los recursos.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Si el archivo está en caché, devolverlo
        return cachedResponse;
      }

      // Si no está en caché, hacer la solicitud a la red
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Guardar la respuesta en caché para futuras solicitudes
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
        });

        return response;
      });
    })
  );
});

// Notificación de actualización de versión para los usuarios
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nueva versión disponible
          console.log('Nueva versión disponible. Recarga la página para actualizar.');
          // Aquí puedes agregar lógica para notificar al usuario de alguna manera
        }
      });
    });
  });
}
