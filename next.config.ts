const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  importScripts: ["sw-custom.js"],
  skipWaiting: true,
});


const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'rkwxsjrwvooyalymhedv.supabase.co' },
      { protocol: 'https', hostname: 'mmhrpgijcpvcvjgrbiem.supabase.co' }
    ],
  },

  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],

  experimental: {
    authInterrupts: true,
  },

  output: 'standalone',
};

module.exports = withPWA(nextConfig);
