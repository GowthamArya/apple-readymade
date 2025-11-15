'use client';

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useLoading } from "../context/LoadingContext";
import { Button, Divider, Form, Input, App, theme } from "antd";
const { useToken } = theme;
export default function AuthPage() {
  const pageLoading = useLoading();
  const { token } = useToken();
  const { message } = App.useApp(); 
  

  const handleEmailSignIn = async (values: { email: string }) => {
    pageLoading.setLoading(true);
    try {
      await signIn("email", {
        email: values.email,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      message.error("Failed to sign in. Try again.");
    }
  };

  const handleGoogleSignIn = () => {
    pageLoading.setLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Form
        className="p-6! m-2 rounded md:w-1/4 text-center"
        layout="vertical"
        style={{ background: token.colorBgContainer, boxShadow: token.boxShadowSecondary }}
        onFinish={handleEmailSignIn}
      >
        <h1 className="text-xl font-bold mb-4!">
          Sign in to Apple Menswear
        </h1>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email to get Link" },
            { type: "email", message: "Please enter a valid email" },
          ]}
          extra="A link will be emailed to you. No password needed."
        >
          <Input type="email" placeholder="Enter your email" autoComplete="email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Get Link</Button>
        </Form.Item>

        <Divider size="large">Other sign-in options</Divider>

        <Button
          type="dashed"
          className="w-full flex justify-center items-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <span className="text-sm">Continue with</span>
          <FcGoogle />
        </Button>
      </Form>
    </div>
  );
}
