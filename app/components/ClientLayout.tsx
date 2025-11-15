'use client';
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../context/LoadingContext";
import Header from "./Header";
import LoadingLayer from "./LoadingLayer";
import InstallPrompt from "./InstallPrompt";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoriteContext";
import { ThemeContext } from "../context/ThemeContext";
import { theme } from "antd";
import Script from "next/script";
import { useEffect } from "react";

function ThemedMain({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();
  return (
    <main
      id="childrenRoot"
      style={{
        backgroundColor: token.colorBgLayout,
        minHeight: "92dvh",
      }}
    >
      {children}
    </main>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const og = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("antd v5 support React is 16 ~ 18")
      ) {
        return;
      }
      og(...args);
    };
    return () => {
      console.error = og;
    };
  }, []);

  const { token } = theme.useToken();
  return (
    <ThemeContext>
        <SessionProvider>
          <CartProvider>
            <FavoritesProvider>
              <LoadingProvider>
                <Header />
                <div className="relative">
                  <InstallPrompt />
                </div>
                <Script id="chatbase-loader" strategy="afterInteractive">
                  {`
                  (function(){
                    if(!window.chatbase || window.chatbase("getState") !== "initialized") {
                      window.chatbase = (...args) => {
                        if(!window.chatbase.q) { window.chatbase.q = []; }
                        window.chatbase.q.push(args);
                      };
                      window.chatbase = new Proxy(window.chatbase, {
                        get(target, prop) {
                          if (prop === "q") return target.q;
                          return (...args) => target(prop, ...args);
                        }
                      });
                    }

                    const onLoad = function() {
                      const script = document.createElement("script");
                      script.src = "https://www.chatbase.co/embed.min.js";
                      script.id = "dXnsoBwvGUwA8nEoO_LEi";  // your ID stays the same
                      script.domain = "www.chatbase.co";
                      document.body.appendChild(script);
                    };

                    if (document.readyState === "complete") onLoad();
                    else window.addEventListener("load", onLoad);
                  })();
                  `}
                </Script>
                <LoadingLayer />
                <ThemedMain>{children}</ThemedMain>
              </LoadingProvider>
            </FavoritesProvider>
          </CartProvider>
        </SessionProvider>
    </ThemeContext>
  );
}
