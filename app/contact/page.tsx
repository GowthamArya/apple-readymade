"use client";

import { Typography, Form, Input, Button } from "antd";

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Contact Us</Typography.Title>
      <Typography.Paragraph>
        Need assistance? Email us at <a href="mailto:support@applereadymade.in">support@applereadymade.in</a> or call +91-9876543210 between 10am–6pm (Mon–Sat).
      </Typography.Paragraph>
      <Form layout="vertical" className="bg-white dark:bg-gray-900 p-4! rounded shadow">
        <Form.Item label="Your Name" name="name"><Input /></Form.Item>
        <Form.Item label="Your Email" name="email"><Input type="email" /></Form.Item>
        <Form.Item label="Message" name="message"><Input.TextArea rows={4} /></Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </main>
  );
}
