"use client";

import { useEffect, useState } from "react";
import { Alert, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export default function FlashSaleBanner() {
    const [sale, setSale] = useState<any>(null);

    useEffect(() => {
        fetch("/api/flash-sales")
            .then(res => res.json())
            .then(data => {
                if (data.sales && data.sales.length > 0) {
                    // Pick the first active sale for now
                    setSale(data.sales[0]);
                }
            })
            .catch(err => console.error("Failed to fetch flash sales", err));
    }, []);

    if (!sale) return null;

    const copyCode = () => {
        navigator.clipboard.writeText(sale.coupon_code);
        message.success("Coupon code copied!");
    };

    return (
        <Alert
            message={
                <div className="flex justify-between items-center w-full">
                    <span>
                        <strong>Flash Sale!</strong> Use code <strong>{sale.coupon_code}</strong> for {sale.discount_percentage}% OFF!
                    </span>
                    <Button size="small" icon={<CopyOutlined />} onClick={copyCode} type="text">
                        Copy
                    </Button>
                </div>
            }
            type="success"
            banner
            closable
        />
    );
}
