'use client';

import { ConfigProvider, theme } from "antd";
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

function ThemedMain({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();

  useEffect(() => {
    // setting CSS vars for theme
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
    // register service worker (client only)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope);
        })
        .catch((err) => console.error("❌ Service Worker registration failed:", err));
    }

    // suppress specific ANTD noisy error (optional but safe)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("antd v5 support")) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <ThemeContext>
      {/* ✨ ANTD Config Provider must wrap BEFORE theme.useToken() */}
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <SessionProvider>
          <CartProvider>
            <FavoritesProvider>
              <LoadingProvider>

                {/* Install prompt + header UI */}
                <InstallPrompt />
                <Header />

                {/* Loading UI layer */}
                <LoadingLayer />

                {/* Your main content */}
                <ThemedMain>{children}</ThemedMain>

                {/* Global loading overlay */}
                <LoadingLayer />

                {/* Chatbase loader — kept as-is */}
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

                {/* (Optional) Brevo widget is commented so it won't break builds */}
                {/* You can enable it later if needed */}

              </LoadingProvider>
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
      </ConfigProvider>
    </ConfigProvider>

    {/* 🐞 Debug consoles must boot after page init, NOT before providers */}
    <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" />
    <Script id="eruda-init" strategy="afterInteractive">{`eruda.init();`}</Script>

  </ThemeContext>
  );
}