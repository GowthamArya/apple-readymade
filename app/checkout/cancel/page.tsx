"use client";

import Link from "next/link";
import { Button, Result, Typography } from "antd";

export default function CancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Result
        status="warning"
        title="Payment was cancelled"
        subTitle="No money was deducted. You can retry safely."
        extra={[
          <Link key="cart" href="/cart?activeTab=cart">
            <Button type="primary">Return to Cart</Button>
          </Link>,
          <Link key="home" href="/">
            <Button>Continue Shopping</Button>
          </Link>,
        ]}
      />
      <Typography.Paragraph className="sr-only">
        Payment did not complete. You can try again from the cart page.
      </Typography.Paragraph>
    </div>
  );
}
