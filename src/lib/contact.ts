/**
 * Shared contact-form contract, imported by both the client form and the server
 * action. Kept out of the `"use server"` action module because that file may
 * only export async functions.
 */

/** What a prospect is reaching out about. */
export const CONTACT_INTERESTS = [
  "Done-for-you AEO (monthly)",
  "Website rebuild (one-time)",
  "Not sure yet — need advice",
  "Something else",
] as const;

export type ContactInterest = (typeof CONTACT_INTERESTS)[number];

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "website" | "interest" | "message", string>
  >;
  /** Echo submitted values back so a failed submit doesn't wipe the form. */
  values?: Record<string, string>;
}
