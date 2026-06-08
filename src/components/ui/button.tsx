import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent font-sans font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Ink button that turns accent on hover — the design default.
        primary: "bg-ink text-bg hover:bg-accent hover:text-white",
        // Solid accent.
        accent: "bg-accent text-white hover:opacity-90",
        // Bordered, panel background.
        ghost:
          "border-line-2 bg-panel text-ink hover:border-accent hover:text-accent",
        // Minimal text link button.
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-[13px] py-2 text-[12.5px]",
        md: "px-[17px] py-[10px] text-[14px]",
        lg: "px-6 py-[14px] text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

type ButtonAsButton = Variants &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Variants &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Button that renders as a Link when `href` is set, otherwise a <button>. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, href, ...rest } = props;
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        {...rest}
      />
    );
  }
  const { variant, size, className, ...rest } = props;
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}

export { buttonVariants };
