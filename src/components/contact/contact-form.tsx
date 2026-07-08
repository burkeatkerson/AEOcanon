"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Check } from "lucide-react";
import { submitContact } from "@/app/(marketing)/contact/actions";
import {
  CONTACT_INTERESTS,
  type ContactState,
} from "@/lib/contact";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const INITIAL: ContactState = { status: "idle" };

const labelCls =
  "text-muted mb-1.5 block font-mono text-[10.5px] tracking-[0.1em] uppercase";
const fieldCls =
  "text-ink placeholder:text-faint border-line-2 bg-panel focus:border-accent focus-visible:outline-accent w-full rounded-lg border px-3.5 py-2.5 font-sans text-[14.5px] transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-1";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg hover:bg-accent hover:text-white focus-visible:outline-accent inline-flex items-center justify-center gap-2 rounded-md px-6 py-[13px] font-sans text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
      {pending ? null : <ArrowRight className="size-4" aria-hidden="true" />}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-bad mt-1.5 text-[12.5px]">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, INITIAL);

  if (state.status === "success") {
    return (
      <div className="border-line bg-panel rounded-2xl border p-8 text-center">
        <span className="bg-accent-soft text-accent mx-auto grid size-12 place-items-center rounded-full">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-[24px]">Message sent — thank you.</h2>
        <p className="text-ink-2 mx-auto mt-2 max-w-[42ch] text-[15px] leading-relaxed">
          We&rsquo;ll reply to your email shortly. Want answers faster? Grab a
          time and we&rsquo;ll talk it through.
        </p>
        <a
          href={siteConfig.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent focus-visible:outline-accent mt-6 inline-flex items-center gap-2 rounded-md px-6 py-[13px] font-sans text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Book a call <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="border-bad rounded-lg border bg-[color-mix(in_oklab,var(--bad)_8%,var(--panel))] px-4 py-3 text-[13.5px] text-[color:var(--bad)]"
        >
          {state.message}
        </p>
      ) : null}

      {/* Honeypot: hidden from humans, catches bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave this blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(fieldCls, errors.name && "border-bad")}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(fieldCls, errors.email && "border-bad")}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="website" className={labelCls}>
          Website <span className="text-faint normal-case">(optional)</span>
        </label>
        <input
          id="website"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          defaultValue={values.website}
          className={fieldCls}
        />
      </div>

      <div>
        <label htmlFor="interest" className={labelCls}>
          What do you need?
        </label>
        <select
          id="interest"
          name="interest"
          required
          defaultValue={values.interest ?? ""}
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? "interest-error" : undefined}
          className={cn(fieldCls, errors.interest && "border-bad")}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {CONTACT_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError id="interest-error" message={errors.interest} />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={values.message}
          placeholder="Tell us about your business and what you're trying to fix."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(fieldCls, "resize-y", errors.message && "border-bad")}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="text-muted text-[12.5px]">
          Prefer to talk? Book a call — top of this page.
        </p>
      </div>
    </form>
  );
}
