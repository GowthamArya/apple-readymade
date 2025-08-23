"use client";
import { useEffect } from "react";
import HeroSection from "./components/Home/HeroSection";
import ShopByCollection from "./components/Home/ShopByCollection";

export default function () {
  return (
    <div className="h-svh">
      <main>
        <HeroSection />
        <ShopByCollection />
      </main>
    </div>
  );
}

