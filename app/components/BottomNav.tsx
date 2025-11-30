"use client";

import { HomeOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, theme } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function BottomNav() {
    const pathname = usePathname();
    const { token } = theme.useToken();
    const { cart } = useCart();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide bottom nav on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const { data: session } = useSession();

    const navItems = [
        {
            key: "/",
            icon: <HomeOutlined style={{ fontSize: 24 }} />,
            label: "Home",
            href: "/",
        },
        {
            key: "/cart",
            icon: (
                <Badge count={cart.length} size="small" offset={[0, -5]}>
                    <ShoppingCartOutlined style={{ fontSize: 24, color: pathname === "/cart" ? token.colorPrimary : token.colorTextSecondary }} />
                </Badge>
            ),
            label: "Cart",
            href: "/cart",
        },
        {
            key: "/account",
            icon: <UserOutlined style={{ fontSize: 24 }} />,
            label: mounted && session ? "Account" : "Login",
            href: mounted && session ? "/account" : "/auth",
        },
    ];

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
            style={{
                backgroundColor: token.colorBgContainer,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                paddingBottom: "env(safe-area-inset-bottom)", // Handle iPhone home bar
                height: "60px",
            }}
        >
            <div className="flex justify-around items-center h-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const color = isActive ? token.colorPrimary : token.colorTextSecondary;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-full h-full"
                            style={{ color }}
                        >
                            <div style={{ color }}>{item.icon}</div>
                            <span style={{ fontSize: 10, marginTop: 2, fontWeight: isActive ? 600 : 400 }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
