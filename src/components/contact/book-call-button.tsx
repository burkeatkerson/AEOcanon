import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

type Variant = "primary" | "accent" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

/**
 * The primary service CTA: books a call on Calendly (opens in a new tab). Single
 * source for the booking link so every "book a call" button stays in sync with
 * siteConfig.calendlyUrl.
 */
export function BookCallButton({
  label = "Book a free call →",
  variant,
  size = "lg",
  className,
}: {
  label?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Button
      href={siteConfig.calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}
