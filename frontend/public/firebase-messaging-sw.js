importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Ye wahi config hai jo tune frontend mein use ki hai
const firebaseConfig = {

  apiKey: process.env.FB_API_KEY,

  authDomain: process.env.FB_AUTH_DOMAIN,

  projectId: process.env.FB_PROJECT_ID,

  storageBucket: process.env.FB_STORAGE_BUCKET,

  messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,

  appId: process.env.FB_APP_ID,

  measurementId: process.env.FB_MESUREMENT_ID

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