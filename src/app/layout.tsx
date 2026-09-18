import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
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
  alternates: { canonical: site.url },
  openGraph: { type: "website", locale: "en_CA", url: site.url, siteName: site.name, title: `${site.name} | ${site.tagline}`, description: site.description },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
  other: { "geo.region": "CA", "geo.placename": "Canada" },
};

export const viewport: Viewport = { themeColor: "#FBFAF7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
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
