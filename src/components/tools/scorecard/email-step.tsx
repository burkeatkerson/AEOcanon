import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EMAIL_STEP } from "@/lib/scorecard/copy";

export interface LeadFields {
  email: string;
  businessName: string;
  location: string;
  /** Honeypot — must stay empty. */
  company: string;
}

/**
 * The email gate, shown beneath the free score. Email is the only required
 * field; business name and location are optional and collected here (the
 * website was already captured earlier). Includes a hidden honeypot.
 */
export function EmailStep({ onSubmit }: { onSubmit: (fields: LeadFields) => void }) {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div>
      <h2 className="text-[clamp(22px,3.4vw,30px)] leading-[1.12] font-medium tracking-[-0.02em]">
        {EMAIL_STEP.heading}
      </h2>
      <p className="text-ink-2 mt-3 max-w-[48ch] text-[15px] leading-relaxed">
        {EMAIL_STEP.sub}
      </p>

      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!emailValid) return;
          onSubmit({
            email: email.trim(),
            businessName: businessName.trim(),
            location: location.trim(),
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
            className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3.5 text-[16px] outline-none transition-colors"
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
              className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3.5 text-[16px] outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-muted mb-1.5 block text-[13px]">
              Location <span className="text-faint">(optional)</span>
            </span>
            <input
              type="text"
              autoComplete="address-level2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3.5 text-[16px] outline-none transition-colors"
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
            Please enter a valid email so we can send your full results.
          </p>
        ) : null}

        <button
          type="submit"
          className="bg-ink text-bg hover:bg-accent hover:text-white mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-[15px] text-[15px] font-medium transition-colors"
        >
          {EMAIL_STEP.button} <ArrowRight className="size-4" aria-hidden />
        </button>

        <p className="text-faint mt-1 text-center text-[12px] leading-relaxed">
          {EMAIL_STEP.microcopy}
        </p>
      </form>
    </div>
  );
}
