'use client';
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";
import { App, ConfigProvider } from "antd";
import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import AntdRegister from "./AntdRegister";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoriteContext";

export default function ClientLayout({ children } : { children: React.ReactNode}) {
  return (
    <AntdRegister>
      <App>
        <SessionProvider>
          <CartProvider>
            <FavoritesProvider>
              <LoadingProvider>
                <div className="relative">
                  <Header />
                  <InstallPrompt />
                </div>
                <LoadingLayer />
                <main id="childrenRoot">
                  {children}
                </main>
              </LoadingProvider>
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
      </App>
    </AntdRegister>
  );
}
