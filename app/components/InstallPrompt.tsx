"use client";
import { Button, theme, Typography, Space, Flex } from "antd";
import { useEffect, useState } from "react";
import { GrInstallOption } from "react-icons/gr";
import { AppleOutlined, CloseOutlined, DownloadOutlined, ExportOutlined } from "@ant-design/icons";

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

  if (!showButton) return null;

  return (
    <div
      className="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:w-[380px] z-[2000] animate-in slide-in-from-left-4 fade-in duration-700"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-5 shadow-2xl border border-white/20 backdrop-blur-2xl"
        style={{
          background: `linear-gradient(135deg, ${token.colorBgElevated}EE 0%, ${token.colorBgContainer}CC 100%)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }}
      >
        {/* Decorative corner element */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: token.colorPrimary }}
        />

        <Button
          type="text"
          size="small"
          className="absolute right-2 -top-2 text-gray-400 hover:text-gray-600 transition-colors"
          icon={<CloseOutlined />}
          onClick={() => setShowButton(false)}
        />

        <Flex gap={20} align="start">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
            style={{ backgroundColor: `${token.colorPrimary}22`, color: token.colorPrimary }}
          >
            {isIOS ? <AppleOutlined className="text-3xl" /> : <DownloadOutlined className="text-3xl" />}
          </div>

          <div className="flex-1 min-w-0">
            <Title level={5} style={{ margin: 0, marginBottom: 4 }}>Add to Home Screen</Title>
            <Text type="secondary" className="text-sm block leading-snug">
              {isIOS
                ? "Experience Apple Premium on your iPhone. Tap the share icon and then 'Add to Home Screen'."
                : "Install our app for a faster, smoother shopping experience and exclusive deals."}
            </Text>

            {!isIOS ? (
              <Button
                type="primary"
                block
                shape="round"
                className="mt-5 h-10 shadow-lg shadow-blue-500/20"
                onClick={handleInstallClick}
                icon={<DownloadOutlined />}
              >
                Install Now
              </Button>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-blue-500 font-medium text-sm">
                <ExportOutlined />
                <span>Tap Share to Install</span>
              </div>
            )}
          </div>
        </Flex>
      </div>
    </div>
  );
}
