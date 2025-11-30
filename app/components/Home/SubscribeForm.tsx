'use client'
import { App, Button, Form, Input, Space } from 'antd';
import React from 'react'
const SubscribeInput = (props: any) => (
  <Space.Compact style={{ width: '100%' }}>
    <Input
      type="email"
      placeholder="Your email"
      {...props}
    />
    <Button
      type="primary"
      htmlType="submit"
    >
      Subscribe
    </Button>
  </Space.Compact>
);

export default function SubscribeForm() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      className="mb-4"
      onFinish={(values) => {
        message.success("Subscribed successfully");
        form.resetFields();
      }}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
        className="mb-2"
      >
        <SubscribeInput />
      </Form.Item>
    </Form>
  )
}   
