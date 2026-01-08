import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import 'antd/dist/reset.css';

import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import ClientLayout from "./components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Viewport } from 'next';
import { Roboto } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { cookies } from 'next/headers';
import AntdRegistry from "@/lib/AntdRegistry";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  // variable: "--font-roboto", // optional if you prefer CSS variables
});
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
    { media: '(prefers-color-scheme: light)', color: '#E4EFE7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://apple-readymade.vercel.app/"),
  title: "Apple Readymade mens wear",
  description: "Apple Readymade offers a collection of men’s shirts, pants, and fashion essentials crafted for comfort and style.",
  openGraph: {
    title: "Apple Readymade mens wear",
    description: "Apple Readymade offers a collection of men’s shirts, pants, and fashion essentials crafted for comfort and style.",
    url: "https://apple-readymade.vercel.app/",
    siteName: "Apple Readymade",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Apple Readymade Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "7khpcoBL-6GoSdhWkvgT6JZleSALk5oIXznyFPumROE",
  },
};




import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookieStore = await cookies();
  const session = await getServerSession(authOptions);

  let theme = cookieStore.get("theme")?.value;

  if (!theme && session?.user?.email) {
    const { data } = await supabase
      .from('user')
      .select('theme_preference')
      .eq('email', session.user.email)
      .single();
    if (data?.theme_preference) {
      theme = data.theme_preference;
    }
  }

  theme = theme || "system";

  return (
    <html lang="en" suppressHydrationWarning >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Apple Readymade" />
        <link rel="apple-touch-icon" href="/Icons/logo-192x192.png" />
      </head>
      <body className={`${roboto.className} ${geistMono.variable} ${ibmPlexMono.variable} antialiased w-full`}>
        <ClientLayout initialTheme={theme}>{children}</ClientLayout>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
