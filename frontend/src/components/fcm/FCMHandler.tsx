"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/lib/firebase";

export default function FCMHandler({ authToken }: any) {
  useEffect(() => {
    const setupFCM = async () => {
      try {

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const messaging = getMessaging(app);

          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
          })

          if (token) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/save-fcm-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({ fcm_token: token }),
              credentials: "include",
            });
            console.log("FCM Token synced!");
          }
        }
      } catch (error) {
        console.error("FCM Registration Error:", error);
      }
    };

    setupFCM();
  }, []);

  return null;
}