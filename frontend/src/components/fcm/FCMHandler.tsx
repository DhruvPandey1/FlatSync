"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/lib/firebase"; // Tera Firebase initialization file

export default function FCMHandler({userId}:any) {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        // 1. Browser se permission maango
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
          const messaging = getMessaging(app);
          
          // 2. Token generate karo
          const token = await getToken(messaging, {
            vapidKey: "BHfuUZyP8Nrpu9rlXMtv056qG5mnqfvi1M8aS0YBBDH53n7G64bnrdYgtXXeECsbEMfdh2OhcV0hxlKXKQoH7_U" // Firebase Console se uthao
          });

          if (token) {
            // 3. Backend (Node.js) ko token bhej do
            await fetch("http://localhost:5000/api/user/save-fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" ,"x-user-id":userId},
              body: JSON.stringify({ fcm_token: token }),
              credentials: "include", // Taaki backend ko session/cookie mil jaye
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

  return null; // Ye kuch render nahi karega
}