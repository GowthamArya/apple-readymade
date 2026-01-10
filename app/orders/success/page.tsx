"use client";

import { Button, Typography } from "antd";
import Link from "next/link";
import { CheckCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function OrderSuccessPage() {
    const { clearCart } = useCart();
    const router = useRouter();
    const [count, setCount] = useState(6);

    useEffect(() => {
        clearCart();

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/orders");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-transparent to-blue-50/20">
            <div className="relative mb-8 text-center">
                {/* Aura Glow Effect */}
                <div className="absolute inset-0 bg-blue-400 blur-[80px] opacity-20 rounded-full animate-pulse" />

                <img
                    src="/images/order-success.png"
                    alt="Order Success"
                    className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl animate-fade-in-up"
                />
            </div>

            <div className="text-center z-10 max-w-md">
                <Typography.Title level={2} style={{ marginBottom: 8 }}>
                    Order Confirmed!
                </Typography.Title>
                <Typography.Text className="text-gray-500 text-lg mb-8 block">
                    Your order has been successfully placed. We've sent a confirmation email to you.
                    <br />
                    <span className="text-sm text-gray-400">Redirecting to orders in {count}s...</span>
                </Typography.Text>

                <div className="flex gap-4 justify-center">
                    <Link href="/orders">
                        <Button type="primary" size="large" icon={<CheckCircleFilled />}>
                            View Order
                        </Button>
                    </Link>
                    <Link href="/collections">
                        <Button size="large">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
