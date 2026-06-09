"use client";

import { useState } from "react";

/**
 * Course preview embed. The presentation is a self-contained bundle (its own
 * styles + JS) served from /public, so it's isolated in an iframe. The 1.3 MB
 * deck is click-to-load: we show the deck's own cover as a poster and only mount
 * the iframe when the visitor opts in (performance + good UX). An always-present
 * "open in new tab" link is the no-JS / fallback path. The embed is a visual
 * enhancement; the page's crawlable content lives in the surrounding HTML.
 */
export function CoursePreview({
  url,
  title,
  poster,
}: {
  url: string;
  title: string;
  /** Cover text for the click-to-load poster (mirrors the deck's own cover). */
  poster?: { headline: string; subhead: string };
}) {
  const [open, setOpen] = useState(false);
  // Shrink the subhead for longer titles so it never overflows the 1200px cover.
  const subheadSize = poster && poster.subhead.length > 14 ? 64 : 80;

  return (
    <section aria-labelledby="course-preview" className="mt-12">
      <h2
        id="course-preview"
        className="text-[26px] font-medium tracking-tight"
      >
        Course preview
      </h2>
      <p className="text-ink-2 mt-2 max-w-[60ch] text-[14.5px] leading-relaxed">
        Flip through the {title} deck for a two-minute overview before you start.
      </p>

      <div className="border-line relative mt-5 aspect-[3/2] overflow-hidden rounded-2xl border bg-[#0b0f17]">
        {open ? (
          <iframe
            src={url}
            title={`${title} — course preview`}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Load the ${title} course preview`}
            className="group absolute inset-0 grid h-full w-full cursor-pointer place-items-center"
          >
            {/* The deck's own branded cover, used as the poster. */}
            <svg
              viewBox="0 0 1200 800"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <rect width="1200" height="800" fill="#0b0f17" />
              {poster ? (
                <>
                  <text
                    x="600"
                    y="430"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontSize="300"
                    fontWeight="500"
                    fill="#eaeef6"
                  >
                    {poster.headline}
                  </text>
                  <text
                    x="600"
                    y="540"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontStyle="italic"
                    fontSize={subheadSize}
                    fill="#82a0ff"
                  >
                    {poster.subhead}
                  </text>
                </>
              ) : (
                <text
                  x="600"
                  y="430"
                  textAnchor="middle"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="120"
                  fontWeight="500"
                  fill="#eaeef6"
                >
                  {title}
                </text>
              )}
            </svg>
            <span className="relative flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 font-sans text-[14.5px] font-medium text-white backdrop-blur-sm transition-colors group-hover:border-white/40 group-hover:bg-black/60">
              <span aria-hidden>▶</span>
              Preview the course
            </span>
          </button>
        )}
      </div>

      <p className="text-muted mt-2 font-sans text-[13px]">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent underline-offset-2 hover:underline"
        >
          Open the presentation in a new tab ↗
        </a>
      </p>
    </section>
  );
}
