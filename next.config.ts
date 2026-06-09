import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler is stable in Next 16. Automatic memoization, zero code changes.
  // Relies on Babel, so expect slightly slower dev/build compile times.
  reactCompiler: true,

  // Content is built by Velite via npm scripts (see package.json), NOT a webpack
  // plugin — Turbopack (the default bundler in Next 16) does not run webpack plugins.

  images: {
    // Serve modern formats; AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
  },

  // typedRoutes is intentionally left off: content URLs are dynamic strings
  // (e.g. article.url) derived from frontmatter, which the Route literal types
  // reject. Referential integrity is instead guaranteed by Velite's build-time
  // validation (see velite.config.ts).

  // The "Learning Paths" surface was renamed to "Courses" (public label).
  // Permanently redirect the old URLs so existing links and indexed pages
  // continue to resolve.
  async redirects() {
    return [
      { source: "/paths", destination: "/courses", permanent: true },
      { source: "/paths/:slug", destination: "/courses/:slug", permanent: true },
      // The thin "framework" overview was consolidated into the comprehensive
      // /learn/aeo-canon hub (the canonical Canon page).
      {
        source: "/learn/the-aeo-canon-framework",
        destination: "/learn/aeo-canon",
        permanent: true,
      },
      // The thin "AEO Fundamentals" path was replaced by the structured
      // AEO Foundations course.
      {
        source: "/courses/aeo-fundamentals",
        destination: "/courses/aeo-foundations",
        permanent: true,
      },
      // Friendly short URL for the DIY measurement guide.
      {
        source: "/measure-aeo",
        destination: "/tools/measure-aeo",
        permanent: false,
      },
      // Friendly short URL for the 30-day small business plan.
      {
        source: "/30-day-aeo-plan",
        destination: "/learn/30-day-aeo-plan",
        permanent: false,
      },
      // The eight pillar deep-dives moved from /learn/aeo-pillar-<name> articles
      // to their own /pillars/<name> section (children of the /aeo-canon hub).
      ...[
        "access",
        "alignment",
        "extractability",
        "authority",
        "credibility",
        "originality",
        "freshness",
        "adaptability",
      ].map((slug) => ({
        source: `/learn/aeo-pillar-${slug}`,
        destination: `/pillars/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
