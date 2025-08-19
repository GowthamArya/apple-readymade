import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono  } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

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

export const metadata: Metadata = {
  title: "Apple",
  description: "Apple Readymade & more. - Mens ware ecommerce website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <div className="relative">
          <Header />
        </div>
        {children}
      </body>
    </html>
  );
}
