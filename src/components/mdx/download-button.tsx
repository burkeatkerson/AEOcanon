/**
 * Download link for a static asset (e.g. a template in /public). Renders a plain
 * anchor with the `download` attribute so the browser downloads the file rather
 * than navigating to it — deliberately NOT routed through next/link. Presentational
 * and static.
 */
export function DownloadButton({
  href,
  children,
  filename,
}: {
  /** Path to the asset, e.g. /aeo-prompt-set-template.csv */
  href: string;
  children: React.ReactNode;
  /** Optional suggested filename for the download. */
  filename?: string;
}) {
  return (
    <a
      href={href}
      download={filename ?? true}
      className="not-prose border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white my-6 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-sans text-[14.5px] font-medium no-underline transition-colors"
    >
      <span aria-hidden>↓</span>
      {children}
    </a>
  );
}
