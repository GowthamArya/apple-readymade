'use client';

export default function Error({ error }: { error: Error }) {
  console.error(error);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h2>Oops! Something broke 🚧</h2>
      <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 8, overflow: "auto" }}>
        {error.message}
      </pre>
    </div>
  );
}