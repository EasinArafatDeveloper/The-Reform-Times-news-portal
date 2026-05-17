self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'The Reform Times';
    const options = {
      body: payload.body || '',
      icon: payload.icon || '/icons/icon-192.png',
      badge: payload.badge || '/icons/badge-72.png',
      data: {
        url: payload.url || '/'
      },
      vibrate: [100, 50, 100],
      actions: payload.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (err) {
    console.error('Push event payload parse error:', err);
    
    // Fallback notification if not valid JSON
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('The Reform Times', {
        body: text,
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        data: { url: '/' }
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(windowClients) {
      // Check if there is already a window open with this URL
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
});
