'use client';

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useLoading } from "../context/LoadingContext";
import { Button, Divider, Form, Input, App, theme, Card, Typography, Space } from "antd";

const { Title, Text } = Typography;

const CompactEmailInput = ({ loading, ...props }: any) => (
  <Space.Compact style={{ width: '100%' }}>
    <Input size="large" type="email" placeholder="Enter your email" autoComplete="email" {...props} />
    <Button type="primary" htmlType="submit" size="large" loading={loading}>
      Get Link
    </Button>
  </Space.Compact>
);

export default function AuthPage() {
  const pageLoading = useLoading();
  const { token } = theme.useToken();
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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card
        style={{ width: '100%', maxWidth: 400, boxShadow: token.boxShadowSecondary }}
      >
        <div className="text-center mb-6">
          <Title level={3} style={{ margin: 0 }}>Sign in</Title>
          <Text type="secondary">to Apple Menswear</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={(values) => handleSignIn("email", values.email)}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email to get Link" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            extra={<Text type="secondary" style={{ fontSize: '12px' }}>A link will be emailed to you. No password needed.</Text>}
          >
            <CompactEmailInput loading={pageLoading.loading} />
          </Form.Item>

          <Divider plain><Text type="secondary" style={{ fontSize: '12px' }}>OR</Text></Divider>

          <Button
            size="large"
            block
            className="flex justify-center items-center gap-2"
            onClick={() => handleSignIn("google")}
            loading={pageLoading.loading}
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </Button>
        </Form>
      </Card>
    </div>
  );
}
