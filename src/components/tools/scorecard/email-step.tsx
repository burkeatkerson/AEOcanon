import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EMAIL_STEP } from "@/lib/scorecard/copy";

export interface LeadFields {
  email: string;
  businessName: string;
  website: string;
  /** Honeypot — must stay empty. */
  company: string;
}

/**
 * The email gate, shown after the last question. Email is required; business
 * name and website are optional. Includes a hidden honeypot field. Submitting
 * with a valid email reveals the results (the parent handles scoring + persist).
 */
export function EmailStep({
  onSubmit,
  back,
}: {
  onSubmit: (fields: LeadFields) => void;
  back: () => void;
}) {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div>
      <h2 className="text-[clamp(24px,3.4vw,34px)] leading-[1.1] font-medium tracking-[-0.02em]">
        {EMAIL_STEP.heading}
      </h2>
      <p className="text-ink-2 mt-3 max-w-[46ch] text-[16px] leading-relaxed">
        {EMAIL_STEP.sub}
      </p>

      <form
        className="mt-7 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!emailValid) return;
          onSubmit({
            email: email.trim(),
            businessName: businessName.trim(),
            website: website.trim(),
            company,
          });
        }}
        noValidate
      >
        <label className="block">
          <span className="text-ink-2 mb-1.5 block text-[13px] font-medium">
            Email <span className="text-accent">*</span>
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            aria-label="Email address"
            aria-invalid={touched && !emailValid}
            className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition-colors"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-muted mb-1.5 block text-[13px]">
              Business name <span className="text-faint">(optional)</span>
            </span>
            <input
              type="text"
              autoComplete="organization"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Acme Co."
              className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-muted mb-1.5 block text-[13px]">
              Website <span className="text-faint">(optional)</span>
            </span>
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="yourbusiness.com"
              className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3 font-mono text-[14px] outline-none transition-colors"
            />
          </label>
        </div>

        {/* Honeypot: hidden from users, catnip for bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>

        {touched && !emailValid ? (
          <p className="text-bad text-[13px]">
            Please enter a valid email so we can send your scorecard.
          </p>
        ) : null}

        <button
          type="submit"
          className="bg-ink text-bg hover:bg-accent hover:text-white mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-[14px] text-[15px] font-medium transition-colors"
        >
          {EMAIL_STEP.button} <ArrowRight className="size-4" aria-hidden />
        </button>

        <p className="text-faint mt-1 text-center text-[12px] leading-relaxed">
          {EMAIL_STEP.microcopy}
        </p>

        <button
          type="button"
          onClick={back}
          className="text-muted hover:text-accent mx-auto cursor-pointer font-mono text-[12px]"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}
