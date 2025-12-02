"use client";
import { Button, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";

export default function InstallPrompt() {
  const { token } = theme.useToken();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);
    window.addEventListener("appinstalled", () => setShowButton(false));
    const timer = setTimeout(() => {
      setShowButton(false);
    }, 60000);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler as any);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();
    const choiceResult = await (deferredPrompt as any).userChoice;
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-4 md:right-auto md:w-96 z-[1000] shadow-lg rounded-lg border p-2 flex justify-between items-center"
      style={{
        backgroundColor: token.colorBgElevated,
        color: token.colorText,
        borderColor: token.colorBorder
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className="rounded-full"
          style={{ backgroundColor: `${token.colorPrimary}1A` }}
        >
          <GrInstallOption className="text-xl" style={{ color: token.colorPrimary }} />
        </div>
        <div className="flex flex-col">
          <Typography.Text strong>Install App</Typography.Text>
          <Typography.Text type="secondary" className="text-xs">
            Get the best experience
          </Typography.Text>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={handleInstallClick}
        >
          Install
        </Button>
        <Button
          type="text"
          size="small"
          icon={<span>✕</span>}
          onClick={() => setShowButton(false)}
        />
      </div>
    </div>
  );
}
