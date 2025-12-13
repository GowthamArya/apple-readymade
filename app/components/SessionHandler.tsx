import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { App } from "antd";

export default function SessionHandler() {
    const { message } = App.useApp();

    useEffect(() => {

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                const url = args[0] as string;
                if (url.startsWith('/api/') && !url.includes('/api/auth')) {
                    message.error("Your session has expired. Please log in again.");
                    signOut({ callbackUrl: "/auth" });
                }
            }
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [message]);

    return null;
}
