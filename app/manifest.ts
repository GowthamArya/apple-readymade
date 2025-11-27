import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apple Readymade",
    short_name: 'AppleReadymade',
    description: '"Apple Readymade" - Your go-to app for buying and selling Apple products with ease and confidence.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: "#3A6F43",
    icons: [
        {
            "src": "/Icons/logo-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/Icons/logo-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
  }
}