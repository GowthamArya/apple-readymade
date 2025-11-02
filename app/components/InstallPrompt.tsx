"use client";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";

export default function InstallPrompt() {
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
    <div className="fixed bottom-5 right-5 z-1 install-prompt p-1 bg-green-100 rounded-xl shadow-lg hover:bg-green-900 transition-all duration-300">
        <Button
            onClick={handleInstallClick}
            type="primary"
        >
            Install App <GrInstallOption className="inline"/>
        </Button>
    </div>
  );
}
