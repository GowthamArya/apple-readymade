"use client";
import React from 'react';
import { Button, theme, Typography } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function AccessDenied() {
  const { token } = theme.useToken();

  return (
    <div
      className="flex flex-col items-center justify-center px-4"
      style={{
        minHeight: '80vh',
        backgroundColor: token.colorBgLayout,
        color: token.colorText
      }}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src="/access_denied_boy.png"
          alt="Access Denied"
          className="w-64 md:w-80 object-contain"
        />
        <Title level={1}>403</Title>
        <Text type="secondary" style={{ fontSize: '18px' }}>
          Sorry, you are not authorized to access this page.
        </Text>
        <Link href="/">
          <Button type="primary" size='middle'>Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
