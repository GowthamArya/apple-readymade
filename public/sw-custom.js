// public/sw-custom.js

self.addEventListener('install', () => {
  console.log('SW installing (custom)... 🔧');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW activated (custom) ✅');
  event.waitUntil(self.clients.claim());
});

// ✅ Handle real push messages safely
self.addEventListener('push', (event) => {
  let payload = { title: "Notification", body: "You have a new update 🔔" };

  try {
    if (event.data) {
      payload = event.data.json(); // parse JSON if valid
    }
  } catch {
    console.warn("Push payload wasn't JSON, using text fallback");
    const text = event.data?.text();
    payload = { title: "Notification", body: text || payload.body };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo.png"
    })
  );
});

// ✅ Handle notification click to focus/open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (
    url.includes('app-build-manifest.json') ||
    url.includes('_buildManifest.js') ||
    url.includes('_ssgManifest.js')
  ) {
    event.respondWith(fetch(event.request)); 
    return;
  }

  if (!event.respondWith) return;
});
