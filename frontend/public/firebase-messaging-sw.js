importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Ye wahi config hai jo tune frontend mein use ki hai
const firebaseConfig = {
  apiKey: "AIzaSyB8mGsYEFxpuR1lLmLuS19tZH07-FyiNLw",
  authDomain: "flatsync-e39f0.firebaseapp.com",
  projectId: "flatsync-e39f0",
  storageBucket: "flatsync-e39f0.firebasestorage.app",
  messagingSenderId: "619139046007",
  appId: "1:619139046007:web:f42b553b42f942f65dc472",
  measurementId: "G-HZKHKDPGWH"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});