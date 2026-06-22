import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Web app manifest. A standard site-quality signal: gives the brand a proper
 * installable identity on mobile and lets browsers/search surfaces resolve a
 * consistent name, theme, and icon. Icons reuse the app's `icon.svg` mark so
 * there's no asset drift. Theme/background mirror the dark brand surface used by
 * the OG card (see src/app/og/route.tsx).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Answer Engine & SEO Education`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    theme_color: "#5b63d6",
    background_color: "#0b0d12",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
