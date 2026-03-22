import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,

  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,

  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,

  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_FB_APP_ID,

  measurementId: process.env.NEXT_PUBLIC_FB_MESUREMENT_ID

};


export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return;
  try {
    const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
    if (token) {
      console.log('Token generated:', token);
      return token;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};