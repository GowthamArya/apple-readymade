'use client';

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useLoading } from "../context/LoadingContext";
import { Button, Form, Input, message } from "antd";

export default function AuthPage() {
  const pageLoading = useLoading();

  const handleEmailSignIn = async (values: { email: string }) => {
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
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/apple-bg.png')" }}
      >
        <div
          id="bgOverBlend"
          className="absolute top-0 left-0 w-full h-full bg-white/70 mix-blend-lighten"
        />
      </div>

      <Form
        className="p-6! m-2 rounded md:w-1/3 bg-white/90 text-center"
        layout="vertical"
        onFinish={handleEmailSignIn}
      >
        <h1 className="text-xl text-green-800 font-bold mb-4">
          Sign in to Apple Menswear
        </h1>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email to get Link" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input  type="email"  placeholder="Enter your email" autoComplete="email"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Get Link</Button>
        </Form.Item>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-400" />
          <span className="text-gray-600 text-sm">Other sign-in options</span>
          <div className="flex-1 h-px bg-gray-400" />
        </div>

        <Button
          type="default"
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
