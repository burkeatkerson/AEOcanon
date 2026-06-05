import { Info, TriangleAlert, Lightbulb, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning" | "success";

const VARIANTS: Record<
  CalloutVariant,
  { icon: typeof Info; className: string; label: string }
> = {
  note: {
    icon: Info,
    className: "border-border bg-muted/50 text-foreground",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    className:
      "border-blue-500/30 bg-blue-500/10 text-foreground [&_svg]:text-blue-500",
    label: "Tip",
  },
  warning: {
    icon: TriangleAlert,
    className:
      "border-amber-500/30 bg-amber-500/10 text-foreground [&_svg]:text-amber-500",
    label: "Warning",
  },
  success: {
    icon: CircleCheck,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-foreground [&_svg]:text-emerald-500",
    label: "Success",
  },
};

/** Highlighted aside usable in any MDX article. */
export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className, label } = VARIANTS[variant];
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4 text-sm leading-relaxed",
        className,
      )}
      role="note"
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        <p className="mb-1 font-semibold">{title ?? label}</p>
        {children}
      </div>
    </div>
  );
}
