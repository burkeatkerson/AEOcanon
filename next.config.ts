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
};

export default nextConfig;
