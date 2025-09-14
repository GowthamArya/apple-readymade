'use client';

import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";

import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <div className="relative">
          <Header />
        </div>
        <LoadingLayer />
        <main id="childrenRoot">
          {children}
        </main>
        <Footer />
      </LoadingProvider>
    </SessionProvider>
  );
}
