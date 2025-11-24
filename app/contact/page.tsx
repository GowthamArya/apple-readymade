"use client";

import { Typography, Form, Input, Button, App } from "antd";

export default function ContactPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();


  const onFinish = (values: any) => {
    form.resetFields();
    message.success("Thank you for your message! We will get back to you soon.");
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <Typography.Title level={2}>Contact Us</Typography.Title>
      <Typography.Paragraph>
        Need assistance? Email us at <a href="mailto:gowtham.arya999@gmail.com">gowtham.arya999@gmail.com</a> or call +91-9391331090 between 10am–6pm (Mon–Sat).
      </Typography.Paragraph>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Your Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Your Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address." },
            { type: "email", message: "Please enter a valid email address." },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Message" name="message" rules={[{ required: true, message: "Please enter your message." }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </main>
  );
}
