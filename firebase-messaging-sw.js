importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDbUE5grCTF86R4Dj7NE_i1Vcmzic67u2U",
  authDomain: "billing-wbm-net.firebaseapp.com",
  projectId: "billing-wbm-net",
  messagingSenderId: "155140597764" // Sender ID kamu
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon-192.png',
    data: { url: payload.fcmOptions.link }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});