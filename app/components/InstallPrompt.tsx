"use client";
import { Button, theme, Typography, Space, Flex } from "antd";
import { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";
import { CloseOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function InstallPrompt() {
  const { token } = theme.useToken();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if IOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // If PWA is already installed, don't show prompt
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);
    window.addEventListener("appinstalled", () => setShowButton(false));

    // Show for IOS if not standalone
    if (ios && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(true);
    }

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

  if (!showButton || isIOS) return null;

  return (
    <div
      className="w-full px-4 py-2 shadow-md flex items-center justify-between z-50 animate-in slide-in-from-top-10 fade-in duration-500 relative mb-2"
    >
      <Flex gap={12} align="center" className="flex-1">
        <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
          <DownloadOutlined className="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <Text className="text-white text-sm font-medium block leading-tight">
            Install App
          </Text>
          <Text className="text-blue-100 text-xs block leading-tight truncate">
            Get the best experience with our app
          </Text>
        </div>
      </Flex>

      <Flex gap={12} align="center">
        <Button
          type="primary"
          size="small"
          onClick={handleInstallClick}
        >
          Install
        </Button>
        <Button
          type="default"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => setShowButton(false)}
        />
      </Flex>
    </div>
  );
}
