'use client'
import { App, Button, Form, Input, message } from 'antd';
import React from 'react'

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
          <Input
            type="email"
            placeholder="Your email"
            className="bg-gray-800 text-white text-sm"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Subscribe
          </Button>
        </Form.Item>
      </Form>
    )
}   
