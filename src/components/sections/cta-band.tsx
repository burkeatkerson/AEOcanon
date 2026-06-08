import { Button } from "@/components/ui/button";

/** Dark, centered final call-to-action band (design `.ov-final`). */
export function CtaBand({
  title,
  description,
  primary,
  secondary,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="bg-ink text-bg rounded-3xl px-8 py-12 text-center sm:px-12 sm:py-16">
      <h2 className="text-bg text-[clamp(30px,4.6vw,48px)] font-medium tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="text-bg/75 mx-auto mt-4 max-w-[46ch] text-[17px]">
          {description}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap justify-center gap-3.5">
        <Button href={primary.href} variant="accent" size="lg">
          {primary.label}
        </Button>
        {secondary ? (
          <Button
            href={secondary.href}
            size="lg"
            className="text-bg border-bg/40 hover:border-accent hover:text-accent border bg-transparent"
          >
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
