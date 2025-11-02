"use client";

import Link from "next/link";
import { Button, Result, Typography } from "antd";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Result
        status="success"
        title="Payment successful!"
        subTitle="Thank you for your order. A confirmation has been recorded."
        extra={[
          <Link key="orders" href="/orders">
            <Button type="primary">View Orders</Button>
          </Link>,
          <Link key="home" href="/">
            <Button>Continue Shopping</Button>
          </Link>,
        ]}
      />
      <Typography.Paragraph className="sr-only">
        Your payment has been verified and your order is being processed.
      </Typography.Paragraph>
    </div>
  );
}
