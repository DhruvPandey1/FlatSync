"use client";

import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FCMHandler({ authToken }: any) {
  const router = useRouter();
  useEffect(() => {
    const setupFCM = async () => {
      try {

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const messaging = getMessaging(app);

          onMessage(messaging, (payload) => {
            console.log("FCM Payload received:", payload);
            const title = payload.notification?.title || payload.data?.title || "New Notification";
            const body = payload.notification?.body || payload.data?.body || "";
            toast.success(`${title}: ${body}`, { duration: 6000 });
            router.refresh();
          });

          const token = await getToken(messaging, {
            vapidKey: "BHfuUZyP8Nrpu9rlXMtv056qG5mnqfvi1M8aS0YBBDH53n7G64bnrdYgtXXeECsbEMfdh2OhcV0hxlKXKQoH7_U"
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