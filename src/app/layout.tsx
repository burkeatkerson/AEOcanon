import type { Metadata } from "next";
import { Newsreader, Spline_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL, siteConfig } from "@/lib/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, organizationNode, websiteNode } from "@/lib/structured-data";

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const sans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spline",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — Answer Engine & SEO Education`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
  },
};

// Set data-theme before first paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var k='aeo-theme';var d=document.documentElement;var t=localStorage.getItem(k)||d.getAttribute('data-theme-default')||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme-default="light"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main"
          className="bg-ink text-bg sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <JsonLd graph={graph([organizationNode(), websiteNode()])} />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ThemeToggle />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N292CPXCB4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-N292CPXCB4');`}
        </Script>

        {/* Vercel Web Analytics (enabled in the Vercel project settings). */}
        <Analytics />
      </body>
    </html>
  );
}
