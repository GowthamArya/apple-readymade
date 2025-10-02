import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import 'antd/dist/reset.css'; 

import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import "locomotive-scroll/dist/locomotive-scroll.css";
import ClientLayout from "./components/ClientLayout";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Viewport } from 'next'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: "100"
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: "Apple",
  description: "Mens wear ecommerce website.",
  manifest: "/manifest.json",
  icons: {
    icon: "/Icons/logo-192x192.png",
    apple: "/Icons/logo-192x192.png",
  },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/Icons/logo-192x192.png" />
      </head>
      <body className={`${geistMono.variable} ${ibmPlexMono.variable} antialiased w-full`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
