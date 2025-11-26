// public/sw-custom.js

self.addEventListener('install', (event) => {
  console.log('SW installing (custom)... 🔧');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW activated (custom) ✅');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = { title: "Notification", body: "You have a new update 🔔" };

  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch (err) {
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

// Optional: listen for notification clicks and focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
