'use client';
import { Button } from "antd";
import { useEffect } from "react";
import SendEmail from "@/emails/SendEmail";

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: error.message + error.stack,
        subject: "Error on the website in " + window.location.href,
        to: "gowtham.arya999@gmail.com",
        from: "Apple Readymade",
      }),
    });
    const timer = setTimeout(() => {
      window.location.reload();
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>Oops! Something broke 🚧</h2>
      <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 8, overflow: "auto" }}>
        {error.message}
      </pre>
      <p>Click the button below to reload the page.</p>
      <Button size="middle" type="primary" onClick={() => window.location.reload()}>Reload</Button>
      <p>Or wait for 3 seconds to reload automatically.</p>
      <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 8, overflow: "auto" }}>
        {error.stack}
      </pre>
    </div>
  );
}