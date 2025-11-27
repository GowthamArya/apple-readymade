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
            icon:  "/logo.png",
            badge:  "/logo.png",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
            },
        })
    );
});
