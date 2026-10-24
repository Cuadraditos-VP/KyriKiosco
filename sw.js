// KyriKiosco: funciona sin conexión.
// Subí el número de versión cada vez que cambies index.html para que el celular tome la nueva.
const VERSION = "kyrikiosco-v1";
const ARCHIVOS = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-32.png",
  // Galería: se guarda entera para elegir imágenes sin internet
  "./galeria/galeria/agua-con-gas.png",
  "./galeria/galeria/agua.png",
  "./galeria/galeria/alfajor.svg",
  "./galeria/galeria/bebidas-alcoholicas.png",
  "./galeria/galeria/bebidas-sin-alcohol.png",
  "./galeria/galeria/bondiola.png",
  "./galeria/galeria/cafe-2.png",
  "./galeria/galeria/cafe.png",
  "./galeria/galeria/carne.png",
  "./galeria/galeria/cerveza.png",
  "./galeria/galeria/choripan.png",
  "./galeria/galeria/empanadas.png",
  "./galeria/galeria/ensalada.svg",
  "./galeria/galeria/fernet.svg",
  "./galeria/galeria/flan.png",
  "./galeria/galeria/fugazzetta.png",
  "./galeria/galeria/helado.png",
  "./galeria/galeria/humita.png",
  "./galeria/galeria/jamon-y-queso.png",
  "./galeria/galeria/jugo-naranja.svg",
  "./galeria/galeria/lata.svg",
  "./galeria/galeria/limonada.svg",
  "./galeria/galeria/mate.svg",
  "./galeria/galeria/medialuna.svg",
  "./galeria/galeria/milanesa.svg",
  "./galeria/galeria/muzzarella.png",
  "./galeria/galeria/pancho.png",
  "./galeria/galeria/papas-fritas.svg",
  "./galeria/galeria/paty.png",
  "./galeria/galeria/pizzas.png",
  "./galeria/galeria/pollo.png",
  "./galeria/galeria/postres.png",
  "./galeria/galeria/sandwich-de-miga.png",
  "./galeria/galeria/sandwiches.png",
  "./galeria/galeria/te.png",
  "./galeria/galeria/torta.png",
  "./galeria/galeria/tostado.svg",
  "./galeria/galeria/vaso-gaseosa.svg",
  "./galeria/galeria/vino.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La página: primero la red (para tomar cambios), si no hay señal la guardada
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // Íconos, tipografías y demás: lo guardado primero
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
