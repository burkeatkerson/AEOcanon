"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminPassword, adminSessionSecret } from "@/lib/env";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifyPassword,
} from "./session";

export interface LoginState {
  error?: string;
}

/**
 * /login form action. Constant-time-checks the submitted password against
 * ADMIN_PASSWORD; on success mints a signed session cookie and redirects to the
 * admin dashboard. On failure returns an error message (the form re-renders).
 * A generic message avoids confirming whether the field was even filled.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = (formData.get("password") as string | null) ?? "";
  if (!password) return { error: "Enter your password." };

  const secret = adminSessionSecret();
  const ok = await verifyPassword(password, adminPassword(), secret);
  if (!ok) return { error: "Incorrect password." };

  const token = await signSession(secret);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

/** Clear the session cookie and return to /login. */
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/login");
}
