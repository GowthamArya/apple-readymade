"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Layout, Menu, Grid, Input, Badge, Button, 
  Avatar, Dropdown, Drawer, theme, Flex, Switch, 
  Typography, 
  Segmented} from "antd"; // **Added Typography**
import { 
  ShoppingOutlined, UserOutlined, MenuOutlined, 
  LogoutOutlined, SettingOutlined, AppstoreOutlined, 
  SunOutlined, MoonOutlined,
  HeartOutlined
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useThemeMode } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

function ThemeToggle() {
  const { mode, setMode } = useThemeMode();

  return (
    <div style={{ display: "inline-flex" }}>
      <Segmented
        shape="round"
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

const navItems = [
  { key: "home", label: <Link href="/">Home</Link> },
  { key: "collections", label: <Link href="/collections">Collections</Link> },
];

export default function AppHeader() {
  const { cart } = useCart();
   const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();
  const { token } = useToken();
  const isMobile = screens.md === false;

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
          label: <span onClick={() => signOut()}>Log out</span>,
        },
      ],
    }),
    [user?.role_name]
  );

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: token.colorBgContainer,
      }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <Link href="/" aria-label="Go Home" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/logo.png" alt="Logo" width={35} height={35} priority />
          {!isMobile && (
            <Text 
              strong 
              style={{ 
                color: token.colorTextHeading,
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '1.25px',
              }}
            >
              Apple
            </Text>
          )}
        </Link>

        {/* Center: Desktop Menu + Search */}
        {!isMobile && (
          <Flex align="center" gap={16}>
            <Menu
              className="w-100 font-semibold text-2xl"
              mode="horizontal"
              items={navItems}
              style={{ borderBottom: "none", background: "transparent", color: token.colorTextHeading }}
            />
            <Input.Search placeholder="Search products" size="large" allowClear style={{ width: 240 }} />
          </Flex>
        )}

        {/* Right: Actions */}
        <Flex align="center" gap={12}>
          {/* Cart */}
          <Link href="/cart?activeTab=wishlist" aria-label="Wishlist">
              <Button type="text" icon={<HeartOutlined style={{ fontSize: 20, color: token.colorTextHeading }} />} />
          </Link>
          <Link href="/cart?activeTab=cart" aria-label="Cart">
            <Badge size="small" count={cart.length} color="green">
              <Button type="text" icon={<ShoppingOutlined style={{ fontSize: 20, color: token.colorTextHeading }} />} />
            </Badge>
          </Link>
          {!isMobile && <ThemeToggle />}
          {/* Account */}
          {user ? (
            <Dropdown menu={accountMenu} trigger={["click"]}>
              <Avatar
                src={user.image}
                icon={!user.image ? <UserOutlined /> : undefined}
                style={{ cursor: "pointer"}}
                alt={user?.name || user?.email || "Account"}
              />
            </Dropdown>
          ) : (
            <Link href="/auth">
              <Button type="primary">Login</Button>
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
            <Image src="/logo.png" alt="Logo" width={28} height={2} />
            {/* MODIFIED: Using Typography.Text for mobile drawer title */}
            <Text strong style={{ fontSize: '1.1rem' }}>Apple</Text>
            <ThemeToggle />
          </Flex>
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        {/* Optional mobile search */}
        <Input.Search placeholder="Search products" allowClear />
        <Menu
          mode="inline"
          className="my-3!"
          items={[
            ...navItems,
            { type: "divider" as const },
            {
              key: "cart",
              label: <Link href="/cart">Cart</Link>,
              icon: <ShoppingOutlined />,
            },
            ...(user
              ? [
                  {
                    key: "settings",
                    label: <Link href="/account">Account Settings</Link>,
                    icon: <SettingOutlined />,
                  },
                  ...(user?.role_name === "admin"
                    ? [{
                        key: "master",
                        label: <Link href="/list/variant">Master Tables</Link>,
                        icon: <AppstoreOutlined />,
                      }]
                    : []),
                  {
                    key: "logout",
                    label: <span onClick={() => signOut()}>Log out</span>,
                    icon: <LogoutOutlined />,
                  },
                ]
              : [
                  {
                    key: "login",
                    label: <Link href="/auth">Login</Link>,
                    icon: <UserOutlined />,
                  },
                ]),
          ]}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </Header>
  );
}