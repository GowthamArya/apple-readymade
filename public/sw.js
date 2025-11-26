
self.addEventListener('install', (event) => {
  console.log('SW installing...');
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('SW activated ✅');
  event.waitUntil(self.clients.claim()); 
});

self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Notification', body: 'New update 🔔' };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png',
    })
  );
});
