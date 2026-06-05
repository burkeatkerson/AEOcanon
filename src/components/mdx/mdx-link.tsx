import Link from "next/link";

/**
 * Anchor used for all MDX links. Internal links (site-relative or in-page)
 * route through next/link for prefetching + client nav; external links open
 * safely with rel noopener.
 */
export function MdxLink({
  href = "",
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
