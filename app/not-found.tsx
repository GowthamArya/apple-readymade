// app/not-found.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { BiHomeSmile } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const [seconds, setSeconds] = useState<number>(5);
    const router = useRouter();
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    router.push("/");
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
        }, [router]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="text-center space-y-4 max-w-md mb-15">
        <h1 className="text-5xl font-extrabold text-green-200">Coming Soon!</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          This page hasn’t been created yet. We’re working on it!
        </p>
      </div>
      <p>Automatially redirect in {seconds} sec...</p>
        <Link
          href="/"
          className="bg-white mt-3 p-3 hover:scale-105 hover:bg-green-200 duration-1000 rounded-full text-black font-medium"
        >
           Back to Home
        </Link>
    </div>
  );
}
