const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  importScripts: ["sw-custom.js"],
  runtimeCaching: [
    {
      urlPattern: /_next\/.*\.js$/i,
      handler: "NetworkOnly",
    },
  ]
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
