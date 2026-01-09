"use client";

import { Button, Typography, theme } from "antd";
import Link from "next/link";
import { CloseCircleFilled, RedoOutlined } from "@ant-design/icons";

export default function OrderFailPage() {
    const { token } = theme.useToken();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-transparent to-red-50/10">
            <div className="relative mb-8 text-center">
                {/* Aura Glow Effect for Failure */}
                <div className="absolute inset-0 bg-red-400 blur-[80px] opacity-10 rounded-full" />

                <img
                    src="/images/order-fail.png"
                    alt="Payment Failed"
                    className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-lg grayscale-[0.2]"
                />
            </div>

            <div className="text-center z-10 max-w-md">
                <Typography.Title level={2} style={{ marginBottom: 8, color: token.colorError }}>
                    Payment Incomplete
                </Typography.Title>
                <Typography.Text className="text-gray-500 text-lg mb-8 block">
                    It seems there was an issue processing your payment. Don't worry, you haven't been charged.
                </Typography.Text>

                <div className="flex gap-4 justify-center">
                    <Link href="/checkout">
                        <Button type="primary" danger size="large" icon={<RedoOutlined />}>
                            Try Again
                        </Button>
                    </Link>
                    <Link href="/cart">
                        <Button size="large">
                            Back to Cart
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
