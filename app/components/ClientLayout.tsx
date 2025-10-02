'use client';
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";
import { App, ConfigProvider } from "antd";
import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import AntdRegister from "./AntdRegister";
import { CartProvider } from "../context/CartContext";

export default function ClientLayout({ children } : { children: React.ReactNode}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorLink: 'inherit',
          colorLinkHover: '#15803d',
          colorLinkActive: '#166534',
        },
      }}
    >
      <App>
        <SessionProvider>
          <CartProvider>
            <AntdRegister>
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
            </AntdRegister>
          </CartProvider>
        </SessionProvider>
      </App>
    </ConfigProvider>
  );
}
