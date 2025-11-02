'use client';
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";
import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoriteContext";
import { ThemeContext } from "../context/ThemeContext";
import { theme } from "antd";

function ThemedMain({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();
  return (
    <main
      id="childrenRoot"
      style={{
        backgroundColor: token.colorBgLayout,
        minHeight: "100dvh",
      }}
    >
      {children}
    </main>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();
  return (
    <ThemeContext>
        <SessionProvider>
          <CartProvider>
            <FavoritesProvider>
              <LoadingProvider>
                <Header />
                <div className="relative">
                  <InstallPrompt />
                </div>
                <LoadingLayer />
                <ThemedMain>{children}</ThemedMain>
              </LoadingProvider>
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
    </ThemeContext>
  );
}
