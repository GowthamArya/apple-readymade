'use strict';

// ✅ NEVER let install fail
self.addEventListener('install', (event) => {
    console.log('🛠 Service Worker installing...');
    self.skipWaiting();
});

// ✅ Always activate in PROD so pushManager works
self.addEventListener('activate', (event) => {
    console.log('⚡ Service Worker activated!');
    event.waitUntil(self.clients.claim());
});

// ✅ Handle push notifications
self.addEventListener('push', (event) => {
    const payload = event.data?.json() || {
        title: "New Alert 🔔",
        body: "You have a fresh update waiting!",
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/Icons/logo-192x192.png", // Ensure this path exists
            badge: "/Icons/logo-192x192.png",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
                url: payload.url || self.location.origin, // Support custom URL
            },
        })
    );
});

// ✅ Handle notification click
self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()

    // Open the URL from the notification data, or the root URL
    const urlToOpen = event.notification.data?.url || self.location.origin;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
})
