import type { Graph } from "schema-dts";

/**
 * Renders a schema.org JSON-LD graph as a native <script> tag. Uses a plain
 * script (not next/script) because this is data, not executable JS, and escapes
 * `<` to prevent XSS via injected content (per Next's JSON-LD guidance).
 */
export function JsonLd({ graph }: { graph: Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
