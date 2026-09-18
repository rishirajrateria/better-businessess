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
  email: "hello@betterbusinesses.ca",
  // TODO: replace with your real business phone (leave empty to hide phone CTAs)
  phone: "+1 (888) 555-0199",
  phoneHref: "tel:+18885550199",
  // TODO: replace with your headquarters. Shown in the footer, contact page & schema.
  hq: {
    street: "",
    city: "Toronto",
    province: "Ontario",
    provinceCode: "ON",
    postalCode: "",
    country: "Canada",
    countryCode: "CA",
    lat: 43.6532,
    lng: -79.3832,
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
} as const;

export type Site = typeof site;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
