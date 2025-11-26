self.addEventListener('push', (event) => {
  let payload = { title: "Update", body: "Something new 🔔" };

  try {
    if (event.data) payload = event.data.json();
  } catch {
    payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo.png"
    })
  );
});
