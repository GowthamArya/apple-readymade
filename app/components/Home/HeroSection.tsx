"use client";

import { useEffect, useRef } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { Climate_Crisis as Herofont } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const herofont = Herofont({
  subsets: ["latin"],
  display: "auto",
  weight: "400",
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
    <div data-scroll className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        id="bgOverBlend2"
        className="absolute top-0 left-0 w-screen h-full object-cover -z-10 filter grayscale"
      >
        <source src="/hero3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      <div className="flex flex-col h-screen items-center justify-end relative z-10 text-end px-3 md:px-10">
        <div className="text-white mb-10 md:mb-20">
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
            MOVE
          </h1>
        </div>
      </div>
    </div>
  );
}
