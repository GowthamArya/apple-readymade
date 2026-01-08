function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

import { subscribeUser } from "@/app/actions";

export default async function subscribeToPush(vapidPublicKey: string) {
  if (!('serviceWorker' in navigator)) {
    console.warn("Service workers not supported in this browser");
    return;
  };

  try {
    const sw = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    console.log("SW registered with scope:", sw.scope);

    const swReady = await navigator.serviceWorker.ready;

    // Always request permission first
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await swReady.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    const serializedSub = JSON.parse(JSON.stringify(subscription));
    await subscribeUser(serializedSub);
    console.log("✅ Push subscribed and saved to DB:", subscription);
    return subscription;
  } catch (err) {
    console.error("❌ Push subscription failed:", err);
  }
}
