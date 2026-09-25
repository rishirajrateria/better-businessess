import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted variable fonts (latin subsets) through next/font so the woff2 files are preloaded
// and served from /_next/static with immutable caching, instead of being discovered late via CSS.
const display = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-display-file",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});
const sans = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-sans-file",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: "Arial",
});
// Italic is rare (emphasis inside articles), so it is not preloaded; globals.css maps em/i to it.
const sansItalic = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-italic.woff2",
  variable: "--font-sans-italic-file",
  weight: "400 700",
  style: "italic",
  display: "swap",
  preload: false,
});
import { Analytics } from "@/components/site/Analytics";
import { RevealObserver } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/site/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Lead Generation, SEO, Web Development & Branding in Canada`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Marketing",
  keywords: ["digital marketing agency Canada", "lead generation", "SEO services", "website development", "branding agency", "logo design", "Google Ads management"],
  alternates: { canonical: site.url, types: { "application/rss+xml": `${site.url}/feed.xml` } },
  openGraph: { type: "website", locale: "en_CA", url: site.url, siteName: site.name, title: `${site.name} | ${site.tagline}`, description: site.description },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    // Bing Webmaster Tools (Bing's index powers ChatGPT search, Copilot and DuckDuckGo).
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  other: { "geo.region": "CA", "geo.placename": "Canada" },
};

export const viewport: Viewport = { themeColor: "#FBFAF7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable} ${sansItalic.variable}`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary" />
      </head>
      <body className="min-h-screen ambient">
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Skip to content</a>
        {children}
        <RevealObserver />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
