"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layout, Menu, Input, Badge, Button, Avatar,
  Dropdown, Drawer, theme, Flex, Typography, Segmented,
  Popover,
  Space,
} from "antd";
import {
  ShoppingOutlined, UserOutlined, MenuOutlined, LogoutOutlined, SettingOutlined,
  AppstoreOutlined, SunOutlined, MoonOutlined, HeartOutlined,
  BellOutlined,
  CheckCircleFilled,
  BellFilled,
  CloseCircleFilled,
  SearchOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useThemeMode } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "../context/LoadingContext";
import { usePathname } from "next/navigation";
import subscribeToPush from "@/lib/config/push-subscription";

function ThemeToggle({ token }: { token: any }) {
  const { mode, setMode } = useThemeMode("dark");

  // Ensure mode is one of the valid options, default to 'system' if undefined
  const currentMode = (mode === 'light' || mode === 'dark' || mode === 'system') ? mode : 'system';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 100, height: 32 }} />; // Placeholder to prevent layout shift
  }

  return (
    <div style={{ display: "inline-flex" }}>
      <Segmented
        shape="round"
        value={currentMode}
        onChange={(val) => setMode(val as "light" | "dark" | 'system')}
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'dark', icon: <MoonOutlined /> },
          { value: 'system', icon: <SettingOutlined /> },
        ]}
      />
    </div>
  );
}

const { Header } = Layout;
const { useToken } = theme;
const { Text } = Typography;

export default function AppHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("searchQuery") || "");
  const [open, setOpen] = useState(false);
  const pageLoading = useLoading();
  const { cart } = useCart();
  const { data: session } = useSession();
  const user = session?.user;
  const { token } = useToken();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSearch(searchParams.get("searchQuery") || "");
  }, [searchParams]);

  const handleLogout = () => {
    pageLoading.setLoading(true);
    signOut();
  };

  const accountMenu = useMemo(
    () => ({
      items: [
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: <Link href="/account">Account Settings</Link>,
        },
        ...(user?.role_name === "admin"
          ? [{
            key: "master",
            icon: <AppstoreOutlined />,
            label: <Link href="/list/variant">Master Tables</Link>,
          }]
          : []),
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={handleLogout}>Log out</span>,
        },
      ],
    }),
    [user?.role_name]
  );

  const menuItems = useMemo(() => {
    return [
      { key: "/", label: <Link href="/">Home</Link> },
      { key: "/collections", label: <Link href="/collections">Collections</Link> },
      { key: "/orders", label: <Link href="/orders">Orders</Link> },
    ];
  }, []);

  function handleSearch(search: string) {
    router.push(`/collections?searchQuery=${search}`);
  }

  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <Header
      className="px-5!"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        maxWidth: "100% !important",
        background: token.colorBgContainer,
        padding: '0 20px',
      }}
    >
      <Flex align="center" justify="space-between" gap={16} style={{ height: '100%' }}>
        {/* Left: Logo */}
        {!mobileSearchVisible && (
          <Link href="/" aria-label="Go Home" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
            <Text
              strong
              className="lg:block hidden"
              style={{
                fontSize: '1.5rem',
              }}
            >
              Apple
            </Text>
          </Link>
        )}

        {/* Mobile Search Input (Overlay) */}
        {mobileSearchVisible && (
          <div className="flex-1 md:hidden flex items-center gap-2">

            <Space.Compact style={{ width: '100%' }}>
              <Input
                autoFocus
                placeholder="Search..."
                onPressEnter={() => {
                  handleSearch(search);
                  setMobileSearchVisible(false);
                }}
                onChange={(e) => {
                  // We need a state for this if we want to use the button.
                  // But wait, 'search' state is already there in Header.tsx.
                  // Let's reuse 'search' state or create a new one if 'search' is for the desktop one.
                  // 'search' state is initialized from URL.
                  setSearch(e.target.value);
                }}
                value={search}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  handleSearch(search);
                  setMobileSearchVisible(false);
                }}
              />
              <Button
                type="text"
                icon={<CloseCircleFilled />}
                onClick={() => setMobileSearchVisible(false)}
              />
            </Space.Compact>
          </div>
        )}

        {/* Center: Desktop Menu + Search */}
        <div className="hidden md:flex items-center flex-1 justify-center gap-8">
          {mounted ? (
            <Menu
              className="font-semibold text-lg border-b-0 min-w-[300px]"
              mode="horizontal"
              items={menuItems}
              selectedKeys={[pathname]}
              style={{ background: 'transparent' }}
            />
          ) : (
            <div style={{ width: 300, height: 46 }} /> // Placeholder
          )}
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Search products"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              allowClear
              onPressEnter={() => {
                setOpen(false);
                handleSearch(search);
              }}
              style={{ width: 'calc(100% - 46px)' }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                setOpen(false);
                handleSearch(search);
              }}
            />
          </Space.Compact>
        </div>

        {/* Right: Actions */}
        <Flex align="center" gap={12}>
          {/* Mobile Search Trigger */}
          {!mobileSearchVisible && (
            <div className="md:hidden">
              <Button
                type="text"
                icon={<SearchOutlined style={{ fontSize: 20 }} />}
                onClick={() => setMobileSearchVisible(true)}
              />
            </div>
          )}

          {/* Cart */}
          <Link href="/cart?activeTab=wishlist" aria-label="Wishlist" className="hidden sm:block">
            <HeartOutlined style={{ fontSize: 22, color: token.colorTextHeading }} />
          </Link>
          <Link href="/cart?activeTab=cart" aria-label="Cart">
            <Badge count={cart.length} color={token.colorPrimary} offset={[0, 0]} size="small">
              <ShoppingOutlined style={{ fontSize: 22, color: token.colorTextHeading }} />
            </Badge>
          </Link>

          {mounted && user && <NotifPopover />}

          <div className="hidden md:block">
            <ThemeToggle token={token} />
          </div>

          {/* Account */}
          {mounted && user ? (
            <Dropdown menu={accountMenu} trigger={["click"]}>
              <Avatar
                src={user.image}
                icon={!user.image ? <UserOutlined /> : undefined}
                style={{ cursor: "pointer" }}
                alt={user?.name || user?.email || "Account"}
              />
            </Dropdown>
          ) : (
            <Link href="/auth" className="hidden md:block">
              <Button type="primary" size="small">Login</Button>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            />
          </div>
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Flex justify="space-between" align="center" gap={8}>
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <Text strong style={{ fontSize: '1.1rem' }}>Apple</Text>
            <ThemeToggle token={token} />
          </Flex>
        }
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Menu
          mode="inline"
          className="my-3!"
          items={[
            ...menuItems,
            { type: "divider" },
            {
              key: "/cart",
              label: <Link href="/cart">Cart</Link>,
              icon: <ShoppingOutlined />,
            },
            ...(user
              ? [
                {
                  key: "/account",
                  label: <Link href="/account">Account Settings</Link>,
                  icon: <SettingOutlined />,
                },
                ...(user?.role_name === "admin"
                  ? [{
                    key: "/list/variant",
                    label: <Link href="/list/variant">Master Tables</Link>,
                    icon: <AppstoreOutlined />,
                  }]
                  : []),
                {
                  key: "logout",
                  label: <span onClick={handleLogout}>Log out</span>,
                  icon: <LogoutOutlined />,
                },
              ]
              : [
                {
                  key: "/auth",
                  label: <Link href="/auth">Login</Link>,
                  icon: <UserOutlined />,
                },
              ])
          ]}
          selectedKeys={[pathname]}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </Header>
  );
}


export function NotifPopover() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { token } = useToken();

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setIsSupported(false);
      return;
    }

    try {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setIsSubscribed(true);
        }
      });
    } catch (err) {
      console.error(err);
    }

    // Fetch in-app notifications
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      })
      .catch(err => console.error("Failed to fetch notifications", err));

  }, []);

  const handleToggle = async () => {
    if (!isSupported) return;

    if (isSubscribed) {
      // Unsubscribe
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } else {
      // Subscribe
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPush(process.env.NEXT_PUBLIC_VAPID_KEY!);
        setIsSubscribed(true);
        setOpen(false);
      }
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  };

  return (
    <Popover
      placement="bottom"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      title={
        <Flex justify="space-between" align="center">
          <Text strong>Notifications</Text>
          {isSupported && (
            <Button
              type="link"
              size="small"
              onClick={handleToggle}
              danger={isSubscribed}
              style={{ padding: 0 }}
            >
              {isSubscribed ? "Disable Push" : "Enable Push"}
            </Button>
          )}
        </Flex>
      }
      content={
        <div style={{ maxWidth: 250, maxHeight: 400, overflowY: 'auto' }}>
          {!isSupported && <Text type="secondary" className="block mb-2">Push notifications not supported on this device.</Text>}

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet.
            </div>
          ) : (
            <Flex vertical gap={8}>
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className="p-3 rounded transition-colors cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  onClick={() => {
                    if (notif.url) window.location.href = notif.url;
                  }}
                >
                  <Flex gap={10} align="start">
                    {notif.image && (
                      <Image
                        src={notif.image}
                        alt="icon"
                        width={40}
                        height={40}
                        className="rounded object-cover h-10 w-10"
                      />
                    )}
                    <div className="flex-1">
                      <Text strong className="block text-sm leading-tight mb-1">{notif.title}</Text>
                      <Text type="secondary" className="text-xs block mb-1">{notif.message}</Text>
                      <Text type="secondary" style={{ fontSize: 10 }}>{new Date(notif.created_at).toLocaleDateString()}</Text>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                      danger
                      onClick={(e) => handleDelete(notif.id, e)}
                    />
                  </Flex>
                </div>
              ))}
            </Flex>
          )}
        </div>
      }
    >
      <Badge count={notifications.length} dot={notifications.length > 0} offset={[-2, 2]}>
        <BellFilled
          style={{
            fontSize: 22,
            cursor: "pointer",
            color: token.colorTextHeading
          }}
        />
      </Badge>
    </Popover>
  );
}
