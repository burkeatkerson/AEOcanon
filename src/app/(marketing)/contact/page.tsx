import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { CalendlyInline } from "@/components/contact/calendly-inline";
import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graph } from "@/lib/structured-data";

const CONTACT_DESCRIPTION =
  "Talk to AEO Canon about becoming the business AI recommends. Book a free call, or send a message and we'll get back to you.";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Work with AEO Canon",
  description: CONTACT_DESCRIPTION,
  path: "/contact",
  eyebrow: "Contact",
});

const REASONS = [
  {
    t: "A free AEO audit",
    d: "See exactly how ChatGPT, Perplexity, and Google AI describe your business today — and what to fix first.",
  },
  {
    t: "Done-for-you service",
    d: "We rebuild your site and publish the content that keeps you the cited answer, month after month.",
  },
  {
    t: "Straight answers",
    d: "Not sure what you need yet? Bring your situation and we'll tell you honestly whether AEO moves the needle for you.",
  },
];

export default function ContactPage() {
  const jsonLd = graph([
    breadcrumbNode([{ name: "Contact", path: "/contact" }]),
  ]);

  return (
    <>
      <JsonLd graph={jsonLd} />
      <header className="py-12 sm:py-14">
        <Container className="max-w-3xl">
          <Kicker>Let&rsquo;s talk</Kicker>
          <h1 className="mt-4 text-[clamp(34px,5vw,54px)] leading-[1.03] font-medium tracking-[-0.025em]">
            Become the business{" "}
            <em className="text-accent [font-style:italic]">AI recommends.</em>
          </h1>
          <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
            The fastest way to start is a quick call — pick a time below and
            we&rsquo;ll walk through where AI puts you today and the
            highest-leverage fixes for your market. Prefer to write? Send a
            message and we&rsquo;ll reply by email.
          </p>
        </Container>
      </header>

      <Container className="pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Primary: book a call */}
          <section aria-labelledby="book">
            <div className="mb-5 flex items-center gap-3">
              <span className="bg-accent text-white grid size-7 place-items-center rounded-full font-mono text-[13px]">
                1
              </span>
              <h2 id="book" className="text-[22px] font-medium">
                Book a free call
              </h2>
            </div>
            <CalendlyInline />
          </section>

          {/* Secondary: send a message */}
          <section aria-labelledby="message">
            <div className="mb-5 flex items-center gap-3">
              <span className="border-line-2 text-ink-2 grid size-7 place-items-center rounded-full border font-mono text-[13px]">
                2
              </span>
              <h2 id="message" className="text-[22px] font-medium">
                Or send a message
              </h2>
            </div>
            <ContactForm />

            <ul className="border-line mt-8 flex flex-col gap-4 border-t pt-6">
              {REASONS.map((r) => (
                <li key={r.t}>
                  <p className="text-ink text-[14.5px] font-medium">{r.t}</p>
                  <p className="text-muted mt-0.5 text-[13.5px] leading-relaxed">
                    {r.d}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
