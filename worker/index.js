// Custom Service Worker logic
self.addEventListener("push", (event) => {
    try {
        const data = event.data.json();
        const { title, body, icon, data: customData } = data;

        const options = {
            body,
            icon: icon || "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
            vibrate: [200, 100, 200],
            data: customData,
            actions: [
                { action: "open", title: "View UZZ 🌕" }
            ]
        };

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
        console.error("Push event error:", err);
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/dashboard";
    
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
