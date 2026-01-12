"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layout, Menu, Badge, Button, Avatar,
  Dropdown, Drawer, theme, Flex, Typography, Segmented,
  Popover,
} from "antd";
import {
  ShoppingOutlined, UserOutlined, MenuOutlined, LogoutOutlined, SettingOutlined,
  AppstoreOutlined, SunOutlined, MoonOutlined, HeartOutlined,
  BellFilled,
  SearchOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useThemeMode } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { useLoading } from "../context/LoadingContext";
import { usePathname } from "next/navigation";
import subscribeToPush from "@/lib/config/push-subscription";
import { createClient } from "@/utils/supabase/client";
import SearchInput from "./SearchInput";
import { id } from "zod/v4/locales";
import InstallPrompt from "./InstallPrompt";

function ThemeToggle() {
  const { mode, setMode } = useThemeMode("dark");

  const currentMode = (mode === 'light' || mode === 'dark' || mode === 'system') ? mode : 'system';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[100px] h-8" />;
  }

  return (
    <div style={{ display: "inline-flex" }}>
      <Segmented
        size="small"
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
  const [open, setOpen] = useState(false);
  const pageLoading = useLoading();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { data: session } = useSession();
  const user = session?.user;
  const { token } = useToken();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            label: <Link href="/list/product">Master Tables</Link>,
          },
          {
            key: "flash-sales",
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/flash-sales">Flash Sales</Link>,
          },
          {
            key: "orders",
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/orders">Manage Orders</Link>,
          },]
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

  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <Header
      className="p-2!"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        maxWidth: "100% !important",
        background: token.colorBgContainer,
        padding: '0 20px',
        height: 'auto', // Allow height to grow
      }}
    >
      <InstallPrompt />
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
            <Suspense fallback={<div className="h-8 w-full" />}>
              <SearchInput mobile onCloseMobile={() => setMobileSearchVisible(false)} />
            </Suspense>
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
              style={{ background: 'transparent', border: 'none' }}
            />
          ) : (
            <div className="w-[300px] h-[46px]" /> // Placeholder
          )}
          <Suspense fallback={<div className="h-8 w-[200px]" />}>
            <SearchInput />
          </Suspense>
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
            <Badge count={favorites.length} color={token.colorPrimary} size="small">
              <HeartOutlined style={{ fontSize: 22, color: token.colorTextHeading }} />
            </Badge>
          </Link>
          <Link href="/cart?activeTab=cart" aria-label="Cart">
            <Badge count={cart.length} color={token.colorPrimary} size="small">
              <ShoppingOutlined style={{ fontSize: 22, color: token.colorTextHeading }} />
            </Badge>
          </Link>


          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {mounted && user && <NotifPopover user={user} />}
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
            <ThemeToggle />
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
            {
              key: "/cart?activeTab=wishlist",
              label: <Link href="/cart?activeTab=wishlist">Wishlist</Link>,
              icon: <HeartOutlined />,
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
                    key: "/list/product",
                    label: <Link href="/list/product">Master Tables</Link>,
                    icon: <AppstoreOutlined />,
                  },
                  {
                    key: "/admin/flash-sales",
                    label: <Link href="/admin/flash-sales">Flash Sales</Link>,
                    icon: <AppstoreOutlined />,
                  },
                  {
                    key: "/admin/orders",
                    label: <Link href="/admin/orders">Manage Orders</Link>,
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


export function NotifPopover({ user }: { user: any }) {
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
    const fetchNotifications = async () => {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    }

    fetchNotifications();

    // Supabase Realtime listener
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-${user?.email || 'broadcast'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${user?.email}&and(isRead=false)`,
        },
        (payload: any) => {
          const newNotif = payload.new;
          if (!newNotif.user_email || newNotif.user_email !== user?.email) return;

          setNotifications((prev) => {
            // Check if already exists to avoid duplicates
            if (prev.some(n => n.id === newNotif.id)) return prev;
            return [newNotif, ...prev];
          });

          // Show browser notification if possible
          if (Notification.permission === 'granted') {
            new Notification(newNotif.title, {
              body: newNotif.message,
              icon: newNotif.image || '/logo.png'
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase Realtime Status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

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

  const handleDelete = async (notif: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      console.log(notif);
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notif?.id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notif?.id));
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
              {isSubscribed ? "Disable" : "Enable"}
            </Button>
          )}
        </Flex>
      }
      content={
        <div className="max-w-[250px] max-h-[400px] overflow-y-auto">
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
                  className="p-3 rounded transition-colors cursor-pointer last:border-0"
                  style={{
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = token.colorFillTertiary}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                      onClick={(e) => handleDelete(notif, e)}
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
            fontSize: 18,
            cursor: "pointer",
            color: token.colorTextHeading
          }}
        />
      </Badge>
    </Popover>
  );
}
