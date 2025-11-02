"use client";

import { Button, theme } from "antd";
const { useToken } = theme;
import { useMemo } from "react";
import { useThemeMode } from "@/app/context/ThemeContext";

export default function HeroSection() {
  const { token } = useToken();
  const { isDark } = useThemeMode();

  const bgStyle = useMemo(() => {
    const gradient = isDark
      ? `linear-gradient(to bottom, ${token.colorBgContainer}, ${token.colorBorderSecondary})`
      : `linear-gradient(to bottom, ${token.colorBgContainer}, white)`;
    return {
      backgroundImage: `url("/small-boy.png"), ${gradient}`,
      backgroundSize: "contain, cover",
      backgroundRepeat: "no-repeat, no-repeat",
      backgroundPosition: "bottom, center", // image anchored bottom, gradient centered
    } as const;
  }, [isDark, token.colorBgContainer, token.colorBorderSecondary]);  // use isDark as dep

  return (
    <section
      className="hero-section min-h-[80vh] flex md:items-end items-center bg-zoom-on-scroll"
      style={bgStyle}
    >
      <div className="flex md:flex-row flex-col h-full w-full md:justify-between justify-center md:items-end p-4 pb-0 md:pb-5">
        <div className="inline-block">
          <h1 className={`${isDark ? "text-shine" : "text-green-950"} m-0! text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight`}>
            MAKE ▲ M◍⨈E●
          </h1>
          <p className="mt-2 text-lg md:text-xl lg:text-2xl text-gray-500">
            Elevate Your Style with Our Exclusive Collection
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="primary" size="large" href="/collections">
            Shop Now
          </Button>
          <Button size="large" href="/about">
            About Us
          </Button>
        </div>
      </div>
    </section>
  );
}
