const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  importScripts: ["sw-custom.js"],
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // keeps Next happy in server mode
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'rkwxsjrwvooyalymhedv.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'mmhrpgijcpvcvjgrbiem.supabase.co', pathname: '/**' }
    ],
  },

  // ✅ Merge your headers here:
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
