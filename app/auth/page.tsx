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

  const handleSignIn = async (provider: "email" | "google", email?: string) => {
    pageLoading.setLoading(true);
    const key = "signIn";
    try {
      message.loading({ content: provider === 'email' ? 'Sending sign-in link...' : 'Redirecting to Google...', key });
      await signIn(provider, {
        email,
        callbackUrl: "/",
        redirect: true,
      });
      message.success({ content: provider === 'email' ? 'Link sent successfully!' : 'Sign-in successful!', key });
    } catch (error) {
      message.error("Failed to sign in. Try again.");
    } finally {
      pageLoading.setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Form
        className="p-6! m-2 rounded md:w-1/4 text-center"
        layout="vertical"
        style={{ background: token.colorBgContainer, boxShadow: token.boxShadowSecondary }}
        onFinish={(values) => handleSignIn("email", values.email)}
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
          <Button type="primary" htmlType="submit" className="w-full" loading={pageLoading.loading}>
            Get Link
          </Button>
        </Form.Item>

        <Divider size="large">Other sign-in options</Divider>

        <Button
          type="dashed"
          className="w-full flex justify-center items-center gap-2"
          onClick={() => handleSignIn("google")}
          loading={pageLoading.loading}
        >
          <span className="text-sm">Continue with Google</span>
          <FcGoogle />
        </Button>
      </Form>
    </div>
  );
}
