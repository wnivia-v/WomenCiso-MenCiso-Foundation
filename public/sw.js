/**
 * Service Worker — WomenCiso y MenCiso Foundation
 *
 * Estrategia: Network First con fallback a cache.
 *
 * Por qué Network First y no Cache First: los datos que muestra la app
 * (camas disponibles, estado de emergencias) cambian constantemente. Servir
 * una versión cacheada de esos datos puede llevar a canalizar un paciente a
 * un hospital sin cupo. El cache solo entra cuando NO hay conexión.
 *
 * Qué se cachea: el shell de la aplicación (HTML, CSS, JS, fuentes, iconos)
 * y las páginas ya visitadas. Esto permite que un paramédico en una zona con
 * señal intermitente pueda al menos llenar el formulario de triage (que guarda
 * en sessionStorage) y enviarlo cuando recupere conexión.
 */

const CACHE_NAME = "womenciso-v1";

// Shell mínimo para que la app abra offline
const SHELL = [
  "/",
  "/emergencias/nueva",
  "/emergencias/extrema",
  "/logo-womenciso-menciso-icon.png",
  "/logo-womenciso-menciso.png",
];

// Instalar: pre-cachear el shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network First, fallback a cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // No interceptar llamadas a APIs (necesitan datos frescos siempre)
  if (request.url.includes("/api/")) return;

  // No interceptar peticiones que no sean GET
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Guardar una copia en cache para uso offline
        if (response.ok) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        }
        return response;
      })
      .catch(() => {
        // Sin red: servir desde cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Si no hay nada en cache, devolver la página principal
          // (el router del lado cliente redirigirá)
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
