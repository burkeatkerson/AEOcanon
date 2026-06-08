import { cn } from "@/lib/utils";

/** Centered max-width content column (matches the design's `.wrap`, 1200px). */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
