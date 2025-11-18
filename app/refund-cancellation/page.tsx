"use client";
import { Typography } from "antd";

export default function RefundCancellationPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Refund & Cancellation Policy</Typography.Title>
      <Typography.Paragraph>
        If you are unsatisfied with your purchase, you may request a cancellation before dispatch, or a return within 7 days of delivery if the product is unused, unwashed, and in its original packaging.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Refunds are processed within 7 business days of accepting your return. Shipping charges are non-refundable. For cancellations, amounts are reversed to the original payment method within 5 business days.
      </Typography.Paragraph>
      <Typography.Paragraph>
        For support, reach us at support@applereadymade.in.
      </Typography.Paragraph>
    </main>
  );
}
