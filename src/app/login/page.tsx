import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

/**
 * /login — the admin entry point. The request proxy (src/proxy.ts) already
 * bounces an authenticated visitor to /admin, so this page only renders for
 * logged-out requests. Noindex: this is an operator surface, not content.
 */
export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main
      style={{
        maxWidth: 360,
        margin: "12vh auto",
        padding: "0 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>AEO Canon Admin</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Sign in to the CRM &amp; campaign console.
      </p>
      <LoginForm />
    </main>
  );
}
