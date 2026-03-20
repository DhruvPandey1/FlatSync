import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {

  apiKey: "AIzaSyB8mGsYEFxpuR1lLmLuS19tZH07-FyiNLw",

  authDomain: "flatsync-e39f0.firebaseapp.com",

  projectId: "flatsync-e39f0",

  storageBucket: "flatsync-e39f0.firebasestorage.app",

  messagingSenderId: "619139046007",

  appId: "1:619139046007:web:f42b553b42f942f65dc472",

  measurementId: "G-HZKHKDPGWH"

};


export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return;
  try {
    const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    if (token) {
      console.log('Token generated:', token);
      return token;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};