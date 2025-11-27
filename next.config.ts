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
    // ✅ Also add Workbox fallback handler via config Mutation (not root options):
  generateSw: {
    sourcemap: false,
    // This line prevents Workbox from crashing on missing precache manifests
    // by giving it an empty manifest implicitly
    additionalManifestEntries: [],
  }
});

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withPWA(nextConfig);