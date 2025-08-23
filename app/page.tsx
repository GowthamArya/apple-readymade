"use client";
import { useEffect } from "react";
import HeroSection from "./components/Home/HeroSection";
import ShopByCollection from "./components/Home/ShopByCollection";

export default function () {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <ShopByCollection />
      </main>
    </div>
  );
}

