"use server";

import { z } from "zod";
import { sendContactConfirmation, sendContactEmail } from "@/lib/email";
import { CONTACT_INTERESTS, type ContactState } from "@/lib/contact";
import { ingestLead } from "@/lib/crm/ingest";

/**
 * Map a declared interest to CRM funnel tags. "Website rebuild" and "Done-for-you"
 * carry the tags the funnel (funnel.ts) uses to enroll into the website/sales drip.
 */
function interestTags(interest: string): string[] {
  switch (interest) {
    case "Website rebuild (one-time)":
      return ["website-interest"];
    case "Done-for-you AEO (monthly)":
      return ["dfy-interest"];
    default:
      return [];
  }
}

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email.")
    .max(200),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  interest: z.enum(CONTACT_INTERESTS, {
    message: "Please choose what you need help with.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (10+ characters).")
    .max(4000),
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: a hidden field real users never see. Bots fill it — if present,
  // pretend success and drop the submission silently.
  if ((formData.get("company") as string)?.trim()) {
    return { status: "success" };
  }

  const raw = {
    name: (formData.get("name") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    website: (formData.get("website") as string) ?? "",
    interest: (formData.get("interest") as string) ?? "",
    message: (formData.get("message") as string) ?? "",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<
        ContactState["fieldErrors"]
      >;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
      values: raw,
    };
  }

  const result = await sendContactEmail(parsed.data);

  if (!result.ok) {
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please book a call instead — it's the fastest way to reach us.",
      values: raw,
    };
  }

  // Best-effort confirmation back to the submitter. Never fails the inquiry —
  // the lead email above already succeeded.
  await sendContactConfirmation(parsed.data);

  // Unify into the CRM: upsert the contact, log the inquiry, tag by interest,
  // and let the funnel enroll website/DFY prospects into the sales drip.
  try {
    await ingestLead({
      email: parsed.data.email,
      name: parsed.data.name,
      website: parsed.data.website || undefined,
      source: "contact_form",
      tags: ["contact-form", ...interestTags(parsed.data.interest)],
      activity: {
        type: "form_submitted",
        title: `Contact form: ${parsed.data.interest}`,
        data: { interest: parsed.data.interest, message: parsed.data.message.slice(0, 500) },
      },
    });
  } catch (err) {
    console.error("[contact] CRM ingest failed:", err);
  }

  return { status: "success" };
}
