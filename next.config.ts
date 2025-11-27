const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  importScripts: ["sw-custom.js"],
   precache() { return []; },          // overrides default precache list
  runtimeCaching: [
    {
      urlPattern: /_next\/.*manifest\.json$/i,
      handler: 'NetworkOnly',
      options: { cacheableResponse: { statuses: [0, 200] } },
    }
  ],

  onError: (err: any) => console.warn("Ignoring Workbox:", err), // soft ignore
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
