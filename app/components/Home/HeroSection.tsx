"use client";

import { useEffect, useRef } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { Climate_Crisis as Herofont } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiaAppleAltSolid } from "react-icons/lia";
import "./Styles.css";
import Link from "next/link";

const herofont = Herofont({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  fallback: ["Impact", "Arial Black", "sans-serif"],
});
interface HeroSectionProps {
  locomotiveReady: boolean;
}

export default function HeroSection({ locomotiveReady }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!locomotiveReady || !titleRef.current) return;

    // Create context for scoped GSAP animations
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        y: 200,
        zoom: 1.2,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top center",
          end: "bottom top",
          scrub: true,
          scroller: "[data-scroll-container]",
        },
      });

      // Refresh ScrollTrigger AFTER layout is fully ready
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => ctx.revert();
  }, [locomotiveReady]);

  return (
    <div data-scroll className="relative min-h-screen w-full overflow-hidden z-2">
      <video
        autoPlay
        loop
        muted
        playsInline
        id="bgOverBlend2"
        webkit-playsinline="true"
        preload="auto"
        className="absolute bg-black top-0 left-0 w-screen h-full object-cover -z-10"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      <div className="flex flex-col h-screen items-center justify-end relative z-10 text-end px-3 md:px-10">
        <div className="text-white mb-20">
          <h1
            ref={titleRef}
            className={`font-extrabold text-end leading-none ${herofont.className} text-2xl md:text-4xl xl:text-[6rem] lg:text-7xl`}
            style={{ transform: "scale(1.2, 1.5)" }}
          >
            MAKE{" "}
            <span
              className="inline-block  text-2xl md:text-5xl"
              style={{ transform: "scale(1.5,1.2)" }}
            >
              <CiLocationArrow1 className="text-white -rotate-45 hover:text-green-400 transition-all duration-700 ease-in-out hover:scale-95 hover:rotate-0" />
            </span>{" "}
            M{" "}
            <Link href="/collections" 
              id="appleIcon"
              className="inline-block text-2xl md:text-4xl xl:text-[6rem] lg:text-7xl"
              style={{ transform: "scale(1.5,1.2)" }}
            >
              <LiaAppleAltSolid  className="icon md:-mb-2 mx-2 text-green-200"/>
            </Link>
            {" "}VE
          </h1>
        </div>
      </div>
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnRxN25rMDZsM29hMDk0a2U4MDRhdG44eWF5bGg5cGJkMzRoZjg4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUOrw4vslaW2a8SaZ2/giphy.gif"
        alt="Preload Background"
        fetchPriority="high"
        className="hidden"
      />
    </div>
  );
}
