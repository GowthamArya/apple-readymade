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

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as any);
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
    <div className="w-full py-2 px-4 flex justify-between items-center z-50 relative" style={{ backgroundColor: token.colorBgLayout, color: token.colorText }}>
      <div className="flex items-center gap-2">
        <GrInstallOption className="text-lg" />
        <Typography.Text>
          Install our app for a better experience
        </Typography.Text>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="small"
          shape="round"
          onClick={handleInstallClick}
        >
          Install
        </Button>
        <button
          onClick={() => setShowButton(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
