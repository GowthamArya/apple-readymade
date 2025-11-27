export default async function subscribeToPush(vapidPublicKey: string, userId: string) {
  if (!('serviceWorker' in navigator)) {
    console.warn("Service workers not supported in this browser");
    return;
  }

  try {
    const sw = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
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
      await fetch('/api/save-subscription', {
          method: 'POST',
          body: JSON.stringify({
              userId: userId,
              subscription: subscription,
          }),
      });
      console.log("✅ Push subscribed:", subscription);
      return subscription;
    }
  } catch (err) {
    console.error("❌ Push subscription failed:", err);
  }
}
