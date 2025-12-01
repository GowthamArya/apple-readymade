"use client";

import { useEffect } from "react";

export default function ErrorLogger() {
    useEffect(() => {
        const originalConsoleError = console.error;

        const logErrorToApi = async (message: string, stack?: string) => {
            try {
                await fetch("/api/logs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                        stack,
                        url: window.location.href,
                        user_agent: navigator.userAgent,
                    }),
                });
            } catch (e) {
                // Prevent infinite loops if logging fails
                originalConsoleError("Failed to send error log to API:", e);
            }
        };

        // Override console.error
        console.error = (...args) => {
            // Filter out specific Ant Design warning
            if (
                typeof args[0] === "string" &&
                (args[0].includes("antd v5 support React is 16 ~ 18") ||
                    args[0].includes("Static function can not consume context"))
            ) {
                return;
            }

            // Call the original console.error first
            originalConsoleError(...args);

            // Convert args to a string message
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');

            // Try to extract a stack trace if possible (e.g. from an Error object)
            const errorObj = args.find(arg => arg instanceof Error);
            const stack = errorObj ? errorObj.stack : new Error().stack;

            logErrorToApi(message, stack);
        };

        // Also listen for unhandled exceptions
        const errorHandler = (event: ErrorEvent) => {
            logErrorToApi(event.message, event.error?.stack);
        };

        // And unhandled promise rejections
        const rejectionHandler = (event: PromiseRejectionEvent) => {
            logErrorToApi(`Unhandled Promise Rejection: ${event.reason}`, event.reason?.stack);
        };

        window.addEventListener("error", errorHandler);
        window.addEventListener("unhandledrejection", rejectionHandler);

        return () => {
            console.error = originalConsoleError;
            window.removeEventListener("error", errorHandler);
            window.removeEventListener("unhandledrejection", rejectionHandler);
        };
    }, []);

    return null;
}
