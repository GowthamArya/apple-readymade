const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  importScripts: ["sw-custom.js"],

  runtimeCaching: [
    {
      urlPattern: /_next\/.*manifest\.json$/i,
      handler: "NetworkOnly",
    }
  ],

  // ✅ NEW WAY: tell Workbox to ignore all 404s and disable precache
  workboxOptions: {
    disableDevLogs: true,
    precacheManifestFilename: null, // ← prevents Workbox from loading precache manifest
    maximumFileSizeToCacheInBytes: 0, // ← disables actual file precaching
    runtimeCaching: [], // optional: ensures no extra caching rules slip in
  }
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "rkwxsjrwvooyalymhedv.supabase.co" },
      { protocol: "https", hostname: "mmhrpgijcpvcvjgrbiem.supabase.co" },
    ],
  },
};

export default withPWA(nextConfig);