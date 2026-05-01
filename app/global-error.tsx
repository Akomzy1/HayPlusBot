"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0B0F",
          color: "#F5F6F8",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
            Something went very wrong
          </h1>
          <p style={{ marginTop: 12, color: "#A4A9B8" }}>
            Even our error boundary fell over. Reloading the page is your best
            bet.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 24,
              padding: "10px 16px",
              borderRadius: 6,
              border: 0,
              background: "#1D9E75",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
