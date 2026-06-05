// Zest Service Worker v2 — Real Push Notifications
const VAPID_PUBLIC_KEY = 'BIeQDK3xiISOHf3RY_JcIS62ssZV2EKYSJjDKe1czz9hHiOrqF8esGXpc_EQFwjd28n2p5DqxGd5WzLtDAdjsME';

self.addEventListener('install', e => {
  self.skipWaiting();
  console.log('Zest SW installed');
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
  console.log('Zest SW activated');
});

// Handle push notifications from server
self.addEventListener('push', function(e) {
  let data = { title: 'Zest 🌿', body: "Don't forget to log today's purchases!", icon: '/icon-192.png' };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch(err) {}
  
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'zest-reminder',
      renotify: true,
      requireInteraction: false,
      data: { url: 'https://zest-za.netlify.app' }
    })
  );
});

// Handle notification click — open the app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('zest-za.netlify.app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('https://zest-za.netlify.app');
    })
  );
});
