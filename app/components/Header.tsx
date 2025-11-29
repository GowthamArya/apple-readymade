"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layout, Menu, Grid, Input, Badge, Button, Avatar,
  Dropdown, Drawer, theme, Flex, Typography, Segmented,
  Popover,
} from "antd";
import {
  ShoppingOutlined, UserOutlined, MenuOutlined, LogoutOutlined, SettingOutlined,
  AppstoreOutlined, SunOutlined, MoonOutlined, HeartOutlined,
  BellOutlined,
  CheckCircleFilled,
  BellFilled,
  CloseCircleFilled
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useThemeMode } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useLoading } from "../context/LoadingContext";
import { usePathname } from "next/navigation";
import subscribeToPush from "@/lib/config/push-subscription";

function ThemeToggle({ token }: { token: any }) {
  const { mode, setMode } = useThemeMode("dark");

  return (
    <div style={{ display: "inline-flex" }}>
      <Segmented
        shape="round"
        style={{ backgroundColor: token.colorPrimary }}
        value={mode}
        onChange={(val) => setMode(val as "light" | "dark")}
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'dark', icon: <MoonOutlined /> },
        ]}
      />
    </div>
  );
}

const { Header } = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function AppHeader() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const pageLoading = useLoading();
  const { cart } = useCart();
  const { data: session } = useSession();
  const user = session?.user;
  const screens = useBreakpoint();
  const { token } = useToken();
  const isMobile = screens.md === false;
  const router = useRouter();

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
    const baseItems = [
      { key: "/", label: <Link href="/">Home</Link> },
      { key: "/collections", label: <Link href="/collections">Collections</Link> },
    ];

    const mobileOnlyItems = [
      { type: "divider" as const },
      {
        key: "/cart",
        label: <Link href="/cart">Cart</Link>,
        icon: <ShoppingOutlined />,
      },
    ];

    const userSpecificItems = user
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
      ];

    if (isMobile) {
      return [...baseItems, ...mobileOnlyItems, ...userSpecificItems];
    }

    return baseItems;
  }, [user, isMobile]);

  function handleSearch(search: string) {
    router.push(`/collections?searchQuery=${search}`);
  }

  return (
    <Header
      className="px-5!"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: token.colorBgContainer,
      }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <Link href="/" aria-label="Go Home" className="inline-flex items-center gap-8">
          <Image src="/logo.png" alt="Logo" width={45} height={45} priority />
          <Text
            strong
            className="lg:block hidden"
            style={{
              fontSize: '1.5rem',
              transition: 'font-size 0.3s ease'
            }}
          >
            Apple
          </Text>
        </Link>

        {/* Center: Desktop Menu + Search */}
        {!isMobile && (
          <Flex align="center">
            <Menu
              className="w-50 font-semibold text-2xl"
              mode="horizontal"
              items={menuItems}
              selectedKeys={[pathname]}
              style={{ borderBottom: "none" }}
            />
            <Input.Search
              placeholder="Search products"
              onSearch={(search) => {
                setOpen(false);
                handleSearch(search);
              }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              allowClear
              style={{ width: 200 }}
            />
          </Flex>
        )}

        {/* Right: Actions */}
        <Flex align="center" gap={18}>
          {/* Cart */}
          <Link href="/cart?activeTab=wishlist" aria-label="Wishlist">
            <HeartOutlined style={{ fontSize: 25, color: token.colorTextHeading }} />
          </Link>
          <Link href="/cart?activeTab=cart" aria-label="Cart">
            <Badge count={cart.length} color={token.colorPrimary} offset={[1, 1]}>
              <ShoppingOutlined style={{ fontSize: 25, color: token.colorTextHeading }} />
            </Badge>
          </Link>
          {user?.id && <NotifPopover userId={user.id} />}
          {!isMobile && <ThemeToggle token={token} />}
          {/* Account */}
          {user ? (
            <Dropdown menu={accountMenu} trigger={["click"]}>
              <Avatar
                src={user.image}
                icon={!user.image ? <UserOutlined /> : undefined}
                style={{ cursor: "pointer" }}
                alt={user?.name || user?.email || "Account"}
              />
            </Dropdown>
          ) : (
            <Link href="/auth">
              <Button type="primary" size="small">Login</Button>
            </Link>
          )}

          {/* Mobile menu trigger */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            />
          )}
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
        <Input.Search placeholder="Search products" onSearch={(search, e) => {
          setOpen(false);
          handleSearch(search);
        }} allowClear />
        <Menu
          mode="inline"
          className="my-3!"
          items={menuItems}
          selectedKeys={[pathname]}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </Header>
  );
}


export function NotifPopover({ userId }: { userId: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setIsSubscribed(true);
        }
      });
    }

    if (Notification.permission !== 'granted' && userId) {
      // Optional: Nudge user if they haven't made a choice yet
      // setOpen(true); 
    }
  }, [userId]);

  const handleToggle = async () => {
    if (isSubscribed) {
      // Unsubscribe
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Optionally call server to remove from DB, though DB handles cleanup on 410
        // await unsubscribeUser(); 
      }
      setIsSubscribed(false);
    } else {
      // Subscribe
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPush(process.env.NEXT_PUBLIC_VAPID_KEY!, userId);
        setIsSubscribed(true);
        setOpen(false);
      }
    }
  };

  return (
    <Popover
      placement="bottom"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      title={isSubscribed ? "Notifications Enabled ✅" : "Enable Notifications"}
      content={
        <Flex vertical gap={10}>
          <Text>{isSubscribed ? "You will receive updates." : "Get notified about new products."}</Text>
          <Button
            type={isSubscribed ? "default" : "primary"}
            size="small"
            onClick={handleToggle}
            danger={isSubscribed}
          >
            {isSubscribed ? "Disable" : "Enable"}
          </Button>
        </Flex>
      }
    >
      <Badge dot={!isSubscribed} offset={[-2, 2]}>
        <BellFilled
          style={{
            fontSize: 22,
            cursor: "pointer",
            color: isSubscribed ? undefined : "gray"
          }}
        />
      </Badge>
    </Popover>
  );
}
