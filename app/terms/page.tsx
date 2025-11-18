"use client";
import { Typography } from "antd";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Terms & Conditions</Typography.Title>
      <Typography.Paragraph>
        By accessing and using Apple Readymade, you agree to comply with all terms. Placing orders constitutes acceptance of these rules. All product images and descriptions are for reference; color or design variations may occur. Prices, offers, and availability are subject to change without notice. We reserve the right to refuse service at our sole discretion.
      </Typography.Paragraph>
      <Typography.Paragraph>
        For disputes, Indian law shall apply and jurisdiction rests with the courts of Telangana.
      </Typography.Paragraph>
    </main>
  );
}
