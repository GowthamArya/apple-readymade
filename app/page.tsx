"use client";

import { useEffect, useRef, useState } from "react";

import HeroSection from "./components/Home/HeroSection";
import ShopByCollection from "./components/Home/ShopByCollection";
import TrustBuilding from "./components/Home/TrustBuilding";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./components/Footer";
gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [locomotiveReady, setLocomotiveReady] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) return;
    let scroll: any;
    import("locomotive-scroll").then((Locomotive) => {
      scroll = new Locomotive.default({
        el: scrollRef.current as HTMLElement,
        smooth: true,
        lerp: 0.1,
        multiplier: 1,
      });

      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollRef.current?.style.transform ? "transform" : "fixed",
      });

      scroll.on("scroll", () => {
        requestAnimationFrame(() => ScrollTrigger.update());
      });

      ScrollTrigger.addEventListener("refresh", () => scroll.update());
      ScrollTrigger.refresh();

      // Mark Locomotive Scroll as ready AFTER refresh
      setLocomotiveReady(true);
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/apple-bg.png')",
        }}
      >
        <div
          id="bgOverBlend"
          className="absolute top-0 left-0 w-full h-full bg-white/90 mix-blend-lighten"
        ></div>
      </div>

      <div ref={scrollRef} data-scroll-container>
        <main data-scroll-section>
          <HeroSection locomotiveReady={locomotiveReady} />
          <ShopByCollection />
          <TrustBuilding />
          <Footer />
        </main>
      </div>
    </div>
  );
}
