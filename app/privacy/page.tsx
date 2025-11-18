"use client";
import { Typography } from "antd";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Privacy Policy</Typography.Title>
      <Typography.Paragraph>
        Apple Readymade collects contact, address, and transaction data only to fulfill your orders and provide required services. Your personal details are never sold. Data is retained per Indian e-commerce guidelines and removed upon written request unless needed for compliance.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Cookies are used to enhance your experience. For data requests or privacy concerns, contact us at support@applereadymade.in.
      </Typography.Paragraph>
    </main>
  );
}
