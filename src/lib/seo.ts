import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";
import type { Faq, Service } from "./services";
import { coreServices } from "./services";
import type { City, Province } from "./locations";

/* ---------------- Metadata ---------------- */
/** Keep meta descriptions inside Google's ~155-char display budget, cutting at a sentence or word boundary. */
export function clampDescription(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentence >= max * 0.55) return head.slice(0, sentence + 1);
  return `${head.slice(0, head.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  /** Use the title verbatim instead of running it through the layout's "%s | Brand" template. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = opts.image ?? absoluteUrl("/opengraph-image");
  const description = clampDescription(opts.description);
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: true } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: opts.type ?? "website",
      url,
      title: opts.title,
      description,
      siteName: site.name,
      locale: "en_CA",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description, images: [image] },
  };
}

/* ---------------- JSON-LD builders ---------------- */
export const orgId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

export function organizationSchema() {
  return {
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    alternateName: ["Better Businesses Canada", "Better Businesses Agency", "betterbusinesses.ca"],
    url: site.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png"), width: 710, height: 458 },
    image: absoluteUrl("/opengraph-image"),
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    foundingDate: `${site.foundedYear}`,
    address: {
      "@type": "PostalAddress",
      ...(site.hq.street ? { streetAddress: site.hq.street } : {}),
      addressLocality: site.hq.city,
      addressRegion: site.hq.provinceCode,
      ...(site.hq.postalCode ? { postalCode: site.hq.postalCode } : {}),
      addressCountry: "CA",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.hq.lat, longitude: site.hq.lng },
    areaServed: { "@type": "Country", name: "Canada" },
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00",
    currenciesAccepted: "CAD",
    paymentAccepted: "Credit Card, Interac e-Transfer, Bank Transfer",
    sameAs: Object.values(site.social),
    knowsAbout: ["Lead Generation", "Search Engine Optimization", "Local SEO", "Google Ads", "Website Development", "Web Design", "Branding", "Logo Design", "Graphic Design", "AI Search Optimization", "Digital Marketing"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Growth Services",
      itemListElement: coreServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/services/${s.slug}`), serviceType: s.schemaServiceType },
      })),
    },
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: site.email, ...(site.phone ? { telephone: site.phone } : {}), areaServed: "CA", availableLanguage: ["English", "French"] }],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": orgId },
    inLanguage: "en-CA",
    potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${site.url}/blog?q={search_term_string}` }, "query-input": "required name=search_term_string" },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqSchema(faqs: Faq[]) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function serviceSchema(service: Service, opts: { path: string; areaName?: string; areaType?: "City" | "State" | "Country"; description?: string }) {
  const area = opts.areaName ? { "@type": opts.areaType ?? "Country", name: opts.areaName } : { "@type": "Country", name: "Canada" };
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.areaName ? `${service.name} in ${opts.areaName}` : service.name,
    serviceType: service.schemaServiceType,
    description: opts.description ?? service.metaDescription,
    url: absoluteUrl(opts.path),
    provider: { "@id": orgId },
    areaServed: area,
    availableChannel: { "@type": "ServiceChannel", serviceUrl: absoluteUrl("/contact"), availableLanguage: ["English", "French"] },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: service.startingPrice.amount,
      priceSpecification: { "@type": "UnitPriceSpecification", priceCurrency: "CAD", price: service.startingPrice.amount, ...(service.startingPrice.unit === "month" ? { unitCode: "MON", billingIncrement: 1 } : {}) },
      description: `Starting price${service.startingPrice.unit === "month" ? " per month" : " per project"}; fixed quotes after a free consultation.`,
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/contact"),
    },
    hasOfferCatalog: { "@type": "OfferCatalog", name: `${service.name} deliverables`, itemListElement: service.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d } })) },
  };
}

export function webPageSchema(opts: { path: string; name: string; description: string; type?: string; datePublished?: string; dateModified?: string }) {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
    inLanguage: "en-CA",
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
  };
}

export function placeSchema(city: City | undefined, province: Province) {
  if (city) return { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: province.name }, geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng } };
  return { "@type": "State", name: province.name, containedInPlace: { "@type": "Country", name: "Canada" } };
}

export const authorId = `${site.url}/#author`;

/** A named human author when configured in site.ts, otherwise the organization. */
export function authorSchema(fallbackName: string) {
  if (site.author.name) {
    return {
      "@type": "Person",
      "@id": authorId,
      name: site.author.name,
      ...(site.author.role ? { jobTitle: site.author.role } : {}),
      ...(site.author.url ? { url: site.author.url, sameAs: [site.author.url] } : {}),
      ...(site.author.bio ? { description: site.author.bio } : {}),
      worksFor: { "@id": orgId },
    };
  }
  return { "@type": "Organization", name: fallbackName, "@id": orgId };
}

export function articleSchema(opts: { path: string; title: string; description: string; image?: string; datePublished: string; dateModified: string; author: string; tags?: string[]; section?: string | null; wordCount?: number }) {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [opts.image] : [absoluteUrl("/opengraph-image")],
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: authorSchema(opts.author),
    publisher: { "@id": orgId },
    mainEntityOfPage: absoluteUrl(opts.path),
    isPartOf: { "@id": websiteId },
    keywords: opts.tags?.join(", "),
    ...(opts.section ? { articleSection: opts.section } : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    inLanguage: "en-CA",
  };
}

export function graph(...nodes: (object | null | undefined)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
