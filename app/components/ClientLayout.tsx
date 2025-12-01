'use client';

import { theme } from "antd";
import Script from "next/script";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";
import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoriteContext";
import { ThemeContext } from "../context/ThemeContext";
import ErrorLogger from "./ErrorLogger";
import BottomNav from "./BottomNav";
import ScrollToTop from "./ScrollToTop";
import FlashSaleBanner from "./FlashSaleBanner";

function ThemedMain({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();

  useEffect(() => {
    document.documentElement.style.setProperty("--bg-layout", token.colorBgLayout);
    document.documentElement.style.setProperty("--scrollbar-thumb", token.colorFillSecondary);
    document.documentElement.style.setProperty("--scrollbar-track", token.colorBgContainer);
  }, [token]);

  return (
    <main
      id="childrenRoot"
      suppressHydrationWarning
      style={{
        backgroundColor: token.colorBgLayout,
        minHeight: "92dvh",
      }}
    >
      {children}
    </main>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => console.error("❌ Service Worker registration failed:", err));
    }
  }, []);

  return (
    <ThemeContext>
      <SessionProvider>
        <CartProvider>
          <FavoritesProvider>
            <LoadingProvider>
              <ErrorLogger />
              <InstallPrompt />
              <ScrollToTop />

              <Header />

              <LoadingLayer />

              <ThemedMain>
                {children}
              </ThemedMain>

              <FlashSaleBanner />
              <BottomNav />

              <LoadingLayer />

              <Script id="chatbase-loader" strategy="afterInteractive">
                {`
                  window.addEventListener("load", function() {
                    try {
                      const script = document.createElement("script");
                      script.src = "https://www.chatbase.co/embed.min.js";
                      script.id = "dXnsoBwvGUwA8nEoO_LEi";
                      script.domain = "www.chatbase.co";
                      document.body.appendChild(script);
                    } catch(e) {
                      console.error("Chatbase loader failed", e);
                    }
                  });
                `}
              </Script>

            </LoadingProvider>
          </FavoritesProvider>
        </CartProvider>
      </SessionProvider>
    </ThemeContext>
  );
}