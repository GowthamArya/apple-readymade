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
            icon: "/Icons/logo-192x192.png",
            badge: "/Icons/logo-192x192.png",
            image: payload.image,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
                url: payload.url || self.location.origin,
            },
        })
    );
});

// ✅ Handle notification click
self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.');
    event.notification.close();

    const urlToOpen = new URL(event.notification.data?.url || '/', self.location.origin).href;

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen) {
                matchingClient = client;
                break;
            }
        }

        if (matchingClient) {
            return matchingClient.focus();
        } else {
            // If no exact match, try to find any window of this origin to focus and navigate
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if ('focus' in client) {
                    return client.focus().then(c => c.navigate(urlToOpen));
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        }
    });

    event.waitUntil(promiseChain);
});
