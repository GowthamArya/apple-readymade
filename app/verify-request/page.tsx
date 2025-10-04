'use client'

import { Button } from "antd";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
            We’ve sent a sign-in link to your email. Click it to log in securely.
        </p>
        <p className="mt-4 text-sm text-gray-500">
            Didn’t receive it? Check your spam folder or try again.
        </p>
        <Link href="/" className="animate-pulse">
            <Button type="primary">Back to Home</Button>
        </Link>
    </div>
  );
}