"use client";
import { Typography } from "antd";

export default function ShippingPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Shipping & Delivery Policy</Typography.Title>
      <Typography.Paragraph>
        Orders are processed within 1-2 business days. Delivery timelines are 3–7 business days for most locations in India. In rare cases (remote areas/public holidays), delivery may be delayed.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Shipping charges (if applicable) are displayed at checkout. Tracking details will be shared by email and SMS after dispatch.
      </Typography.Paragraph>
    </main>
  );
}