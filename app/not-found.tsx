// app/not-found.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, theme, Typography } from "antd";
import { useLoading } from "./context/LoadingContext";

const { Title, Text } = Typography;

export default function NotFound() {
  const [seconds, setSeconds] = useState<number>(5);
  const router = useRouter();
  const { token } = theme.useToken();
  const pageLoading = useLoading();
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      pageLoading.setLoading(true);
      window.location.href = "/";
    }
  }, [seconds]);

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
          src="/not_found_boy.png"
          alt="Page Not Found"
          className="w-64 md:w-80 object-contain"
        />
        <Title level={1} style={{ margin: '0 0 2px 0' }}>404</Title>
        <Text type="secondary" style={{ fontSize: '18px' }}>
          Sorry, the page you visited does not exist.
        </Text>
        <div className="flex flex-col items-center">
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Automatically redirecting in {seconds} seconds...
          </Text>
          <Link href="/">
            <Button type="primary" size="middle">Back Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
