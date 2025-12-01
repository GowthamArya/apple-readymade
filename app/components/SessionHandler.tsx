import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { App } from "antd";

export default function SessionHandler() {
    const { data: session, status } = useSession();
    const { message } = App.useApp();

    useEffect(() => {
        // If the session is unauthenticated but we previously thought we were logged in (or just generally checking)
        // and we receive a 401 from an API call, we might want to trigger this.
        // However, for a global check, we can rely on the session status.

        // If the session expires, next-auth usually sets status to "unauthenticated".
        // We can listen for specific events or just check status transitions if needed.

        // But the user specifically asked: "if the user is in checkout page and when we use user session and not athenticated we need to tell them your session is expired and need them to login again"

        // This component can be placed in the layout to monitor session state globally.
        // Or we can create a custom hook.

        // A more robust way to handle API 401s globally is to intercept fetch requests.
        // Since we can't easily intercept all fetches in RSC/Client components globally without a wrapper,
        // we will implement a global fetch interceptor effect here.

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                // Check if the URL is one of our internal APIs
                const url = args[0] as string;
                if (url.startsWith('/api/') && !url.includes('/api/auth')) {
                    // It's an internal API call that returned 401 Unauthorized
                    // This likely means the session is invalid/expired on the server
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
