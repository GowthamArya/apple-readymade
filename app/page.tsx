"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from 'lenis';

import HeroSection from "./components/Home/HeroSection";
import ShopByCollection from "./components/Home/ShopByCollection";
import TrustBuilding from "./components/Home/TrustBuilding";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./components/Footer";
import FlashSaleBanner from "./components/FlashSaleBanner";
gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center">
        <div
          id="bgOverBlend"
          className="absolute top-0 left-0 w-full h-full bg-white/90 mix-blend-lighten"
        ></div>
      </div>

      <div>
        <main>
          <HeroSection />
          <ShopByCollection />
          <TrustBuilding />
          <FlashSaleBanner />
          <Footer />
        </main>
      </div>
    </div>
  );
}
