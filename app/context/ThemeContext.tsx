"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { App, ConfigProvider, theme as antdTheme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

type Mode = "light" | "dark" | "system";

type ThemeCtxValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  isDark: boolean;
};

const ThemeCtx = createContext<ThemeCtxValue>({
  mode: "system",
  setMode: () => {},
  isDark: false,
});

export function ThemeContext({ children }: { children: React.ReactNode }) {
  // SSR-safe init: hydrate from localStorage on client
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mode") as Mode | null;
      if (saved) setMode(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("mode", mode);
    } catch {}
  }, [mode]);

  const [prefersDark, setPrefersDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    setPrefersDark(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const isDark = mode === "dark" || (mode === "system" && prefersDark);

  const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm; 

  const theme = useMemo(
    () => ({
      algorithm,
      token: {
        colorText: isDark ? "#D1D5DB" : "#374151",
        colorBackground: isDark ? "#000000" : "#E4EFE7",
        colorBgContainer: isDark ? "#000000" : "#E4EFE7",
        colorBgLayout: isDark ? "#18230F" : "#CEE5D0",
        colorBorderSecondary: isDark ? "#18230F" : "#E4EFE7",
        colorBorder: isDark ? "#374151" : "#B8C4A9",
        colorPrimary: "#3A6F43",
        colorLink: isDark ? "#3A6F43": "#276749",
        colorLinkHover: "#2f5735",
        colorLinkActive: "#25462b",   
        borderRadius: 8,
      },
    }),
    [algorithm]
  );

  return (
    <ThemeCtx.Provider value={{ mode, setMode, isDark }}>
      <AntdRegistry>
        <ConfigProvider theme={theme} componentSize="large">
          <App>{children}</App>
        </ConfigProvider>
      </AntdRegistry>
    </ThemeCtx.Provider>
  );
}

export function useThemeMode(theme?: string) {
  return useContext(ThemeCtx);
}
