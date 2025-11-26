const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log("\n🚀 Your VAPID Keys generated!\n");
console.log("Public  Key:", vapidKeys.publicKey);
console.log("Private Key:", vapidKeys.privateKey);
