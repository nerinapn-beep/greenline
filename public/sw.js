// Zest Service Worker — Push Notifications
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', function(e) {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Zest 🌿';
  const body = data.body || "Don't forget to log today's purchases!";
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [200, 100, 200],
      tag: 'zest-reminder',
      renotify: true,
      data: { url: 'https://zest-za.netlify.app' }
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || 'https://zest-za.netlify.app'));
});
