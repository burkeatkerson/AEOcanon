import { cn } from "@/lib/utils";

type CalloutVariant = "insight" | "tip" | "warning" | "key" | "definition";

const VARIANTS: Record<
  CalloutVariant,
  { container: string; head: string; defaultLabel: string }
> = {
  insight: {
    container: "border-l-[3px] border-accent bg-accent-soft",
    head: "text-accent-2",
    defaultLabel: "Insight",
  },
  tip: {
    container: "border border-dashed border-line-2 bg-bg-2",
    head: "text-ok",
    defaultLabel: "Tip",
  },
  warning: {
    container:
      "border-l-[3px] border-warn bg-[color-mix(in_oklab,var(--warn)_10%,var(--panel))]",
    head: "text-warn",
    defaultLabel: "Heads up",
  },
  key: {
    container: "bg-ink text-bg",
    head: "text-accent",
    defaultLabel: "Key point",
  },
  definition: {
    container: "border border-line-2 bg-panel",
    head: "text-accent",
    defaultLabel: "Definition",
  },
};

/** Editorial callout usable in any MDX article (mirrors the design `.co`). */
export function Callout({
  variant = "insight",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const v = VARIANTS[variant];
  return (
    <div
      className={cn(
        "my-7 rounded-xl px-6 py-5 font-sans text-[15px] leading-relaxed",
        v.container,
      )}
      role="note"
    >
      <p
        className={cn(
          "mb-2 font-mono text-[10.5px] tracking-[0.1em] uppercase",
          v.head,
        )}
      >
        {title ?? v.defaultLabel}
      </p>
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
