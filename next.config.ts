// next.config.js

const withPWAInit = require('next-pwa');
const isDev = process.env.NODE_ENV !== 'production';

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'rkwxsjrwvooyalymhedv.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'mmhrpgijcpvcvjgrbiem.supabase.co', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
