"use client";

import { useRef } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site";

interface CalendlyGlobal {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
}

/**
 * Calendly inline scheduler — the prominent, primary way to reach Burke. Loads
 * Calendly's official widget script and initializes explicitly on load (rather
 * than relying on data-url auto-init) so it works on client-side navigations
 * too. The inner anchor is a real, working fallback if JavaScript is disabled
 * or the widget fails — it opens the scheduler in a new tab either way.
 */
export function CalendlyInline() {
  const ref = useRef<HTMLDivElement>(null);
  const url = `${siteConfig.calendlyUrl}?hide_gdpr_banner=1`;

  return (
    <div className="border-line bg-panel overflow-hidden rounded-2xl border">
      <div
        ref={ref}
        className="min-h-[680px]"
        style={{ minWidth: 320 }}
      >
        {/* Fallback shown until the widget initializes (and if JS is off). */}
        <div className="flex min-h-[680px] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-ink-2 max-w-[40ch] text-[15px] leading-relaxed">
            Pick a time that works and we&rsquo;ll talk through where AI puts you
            today and the highest-leverage fixes for your business.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent inline-flex items-center gap-2 rounded-md px-6 py-[13px] font-sans text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Open the scheduler →
          </a>
        </div>
      </div>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          const w = window as unknown as { Calendly?: CalendlyGlobal };
          if (w.Calendly && ref.current) {
            ref.current.innerHTML = "";
            w.Calendly.initInlineWidget({ url, parentElement: ref.current });
          }
        }}
      />
    </div>
  );
}
