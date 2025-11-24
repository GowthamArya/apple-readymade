'use client'

import { Button } from "antd";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-lg">
            We’ve sent a sign-in link to your email. Click it to log in securely. No Passwords required.
        </p>
        <p className="mt-4 text-sm text-gray-500">
            Didn’t receive it? Check your spam folder or try again.
        </p>
        <Button href="/" className="animate-pulse" type="primary">Back to Home</Button>
    </div>
  );
}