// sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});


self.addEventListener('push', (event) => {
  try {
    const payload = event.data.json();
    const options = {
      body: payload.body,
      icon: '/logo.png',
      // You can add more options here, such as 'image', 'badge', etc.
    };

    event.waitUntil(
      self.registration.showNotification(payload.title, options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  try {
    // Add custom behavior for notification click, such as opening a specific URL
    clients.openWindow('/contact');
  } catch (error) {
    console.error('Error handling notification click event:', error);
  }
});
