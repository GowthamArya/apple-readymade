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
    navigator.serviceWorker.ready.then(sw => {
      console.log("🔥 SW active?", sw.active !== null);
    });

    console.log("SW is ready:", swReady);
    console.log("SW is active:", swReady.active);
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      const subscription = await swReady.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });
      const serializedSub = JSON.parse(JSON.stringify(subscription));
      await subscribeUser(serializedSub);
      console.log("✅ Push subscribed and saved to DB:", subscription);
      return subscription;
    }
  } catch (err) {
    console.error("❌ Push subscription failed:", err);
  }
}
