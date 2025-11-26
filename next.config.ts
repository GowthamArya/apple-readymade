const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  importScripts: ['sw-custom.js'],

  exclude: [
    /app-build-manifest\.json$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/apple-readymade\.vercel\.app\/_next\/.*/i,
      handler: 'NetworkOnly', // avoids caching _next assets via Workbox
    }
  ],
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
