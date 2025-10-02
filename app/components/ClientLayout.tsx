'use client';
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";

import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import AntdRegister from "./AntdRegister";

export default function ClientLayout({ children } : { children: React.ReactNode}) {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}
