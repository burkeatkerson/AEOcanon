import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/** A page section with the design's vertical rhythm + top rule. */
export function Section({
  children,
  className,
  bordered = true,
  id,
  "aria-labelledby": ariaLabelledby,
}: {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  id?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "py-13 sm:py-16",
        bordered && "border-line border-t",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Heading row: serif h2 + mono eyebrow, baseline-aligned (design `.section__head`). */
export function SectionHead({
  title,
  eyebrow,
  id,
  action,
}: {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-5">
      <h2 id={id} className="text-[28px] font-medium tracking-tight">
        {title}
      </h2>
      {eyebrow ? (
        <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
          {eyebrow}
        </span>
      ) : null}
      {action}
    </div>
  );
}
