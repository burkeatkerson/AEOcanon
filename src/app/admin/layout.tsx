import type { Metadata } from "next";
import type { ReactNode } from "react";
import { logout } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/guard";

/**
 * Admin shell + hard gate. `requireAdmin()` runs on every admin render and
 * redirects to /login without a valid session — the proxy is the first gate,
 * this is the authoritative one. The visual design (nav, panels, tables) is the
 * front-end phase; this is the minimal wired frame the backend needs to be
 * testable end-to-end.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a1a" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <strong style={{ fontSize: 15 }}>AEO Canon · Admin</strong>
        <form action={logout}>
          <button
            type="submit"
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </header>
      <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>{children}</main>
    </div>
  );
}
