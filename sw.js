// Çevrimdışı çalışma: uygulama dosyalarını önbelleğe alır.
// Dosyaları güncellediğinde SURUM'ü artır ki telefonlar yeni sürümü alsın.
// Bildirimler: OneSignal'in push işleyicisini bu service worker'a dahil et
try { importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js"); } catch (e) { /* çevrimdışı */ }

const SURUM = "waitformemom-v6";
const DOSYALAR = [
  "./", "./index.html", "./privacy.html", "./manifest.webmanifest",
  "./css/style.css",
  "./js/foods.js", "./js/weeks.js", "./js/content.js", "./js/i18n.js",
  "./js/lang/en.js", "./js/lang/de.js", "./js/lang/ar.js", "./js/lang/ru.js", "./js/app.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SURUM).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Yazı tipleri: önce önbellek, yoksa ağdan alıp sakla
  if (url.host.includes("fonts.googleapis.com") || url.host.includes("fonts.gstatic.com")) {
    e.respondWith(caches.open(SURUM).then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // Uygulama dosyaları: önce ağ (güncel kalsın), bağlantı yoksa önbellek
  e.respondWith(
    fetch(e.request).then((res) => {
      const kopya = res.clone();
      caches.open(SURUM).then((c) => c.put(e.request, kopya));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
