"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/actions";

const INITIAL: LoginState = {};

/**
 * The /login form. Posts to the `login` server action, which sets the session
 * cookie and redirects to /admin on success or returns an error message here.
 * Intentionally plain — the admin visual design lands in the front-end phase.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <form action={formAction} style={{ display: "grid", gap: 12 }}>
      <label htmlFor="password" style={{ fontSize: 14, fontWeight: 600 }}>
        Admin password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 15,
        }}
      />
      {state.error ? (
        <p role="alert" style={{ color: "#b91c1c", fontSize: 14, margin: 0 }}>
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: "#1a1a1a",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: pending ? "default" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
