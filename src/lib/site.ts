/**
 * Global site configuration — the single source of truth for
 * name / address / phone (NAP), URLs and social links.
 * Keep this consistent everywhere (Google Business Profile, directories, socials)
 * so search engines and AI models resolve "Better Businesses" as one entity.
 */
export const site = {
  name: "Better Businesses",
  legalName: "Better Businesses Inc.",
  tagline: "Strategy. Growth. Results.",
  description:
    "Better Businesses is a Canadian digital growth agency offering lead generation, SEO, website development and branding for businesses across Canada.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://betterbusinesses.ca").replace(/\/$/, ""),
  domain: "betterbusinesses.ca",
  email: "connect@betterbusinesses.ca",
  // Set your real business phone here (E.164 in phoneHref). Leaving both empty hides every
  // phone CTA and omits `telephone` from the LocalBusiness schema — never ship a placeholder,
  // a wrong number in structured data damages local rankings and AI answers.
  phone: "+1 (647) 472-5989",
  phoneHref: "tel:+16474725989",
  // Headquarters. Shown in the footer, contact page & LocalBusiness schema. Keep identical to Google Business Profile.
  hq: {
    street: "3391 Bloor Street West",
    city: "Etobicoke",
    province: "Ontario",
    provinceCode: "ON",
    postalCode: "M8X 1G3",
    country: "Canada",
    countryCode: "CA",
    // Bloor St W & Islington Ave, Etobicoke (approximate building location)
    lat: 43.6452,
    lng: -79.526,
  },
  hours: "Monday to Friday, 9:00 AM to 6:00 PM (Eastern Time)",
  foundedYear: 2019,
  social: {
    linkedin: "https://www.linkedin.com/company/betterbusinesses",
    instagram: "https://www.instagram.com/betterbusinesses.ca",
    facebook: "https://www.facebook.com/betterbusinesses.ca",
    x: "https://x.com/betterbusinessca",
    youtube: "https://www.youtube.com/@betterbusinesses",
  },
  // Used in copy across the site — keep believable and update as you grow.
  stats: {
    projects: "250+",
    leadsGenerated: "48,000+",
    avgRoi: "6.2x",
    retention: "94%",
    yearsExperience: `${new Date().getFullYear() - 2019}+`,
  },
  bookingUrl: "/contact",
  /**
   * Named author for blog articles (E-E-A-T). Fill in a real person: name, role, a public profile
   * URL (LinkedIn) and a one-line bio. With an empty name, articles stay attributed to the company.
   */
  author: { name: "", role: "", url: "", bio: "" },
  /**
   * Date the fixed site copy (services, locations, FAQs) last changed. Drives <lastmod> for the
   * ~420 non-CMS pages in the sitemap. Bump it when you edit content — never on every deploy,
   * or search engines learn to ignore the sitemap's dates.
   */
  staticContentUpdated: "2026-10-07",
} as const;

export type Site = typeof site;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

/** One-line postal address, e.g. "3391 Bloor Street West, Etobicoke, ON M8X 1G3". */
export const fullAddress = [site.hq.street, `${site.hq.city}, ${site.hq.provinceCode} ${site.hq.postalCode}`.trim()].filter(Boolean).join(", ");
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${fullAddress}, Canada`)}`;
