/**
 * Programmatic content engine.
 * Produces rich, deterministic and varied copy for every
 * service × location combination so no two pages read the same.
 */
import { site } from "./site";
import type { Service } from "./services";
import { getService, getSubServices, coreServices } from "./services";
import type { City, Province } from "./locations";
import { getProvince, getCitiesInProvince, getNearbyCities } from "./locations";
import type { Faq } from "./services";

/* ---------------- deterministic helpers ---------------- */
export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}
const pick = <T,>(arr: T[], seed: string, offset = 0): T => arr[(hash(seed) + offset) % arr.length];
const list = (items: string[], max = 3, conj = "and") => {
  const a = items.slice(0, max);
  if (a.length <= 1) return a.join("");
  return `${a.slice(0, -1).join(", ")} ${conj} ${a[a.length - 1]}`;
};
const lower = (s: string) => s.toLowerCase();

/* ---------------- service-specific local angles ---------------- */
const localAngles: Record<string, (c: City, p: Province) => string[]> = {
  "lead-generation": (c, p) => [
    `Buyers in ${c.name} search, compare and decide fast. Our campaigns place your offer in front of ${c.name} residents and businesses at the moment of intent, then route every call and form to your team within seconds.`,
    `Because ad costs in ${c.name} vary widely between ${lower(c.industries[0])} and ${lower(c.industries[1])}, we build separate campaigns per service line and geography, so budget flows to the ${c.name} neighbourhoods and offers that produce the cheapest qualified leads.`,
    `We geo-target ${list(c.areas, 4)} and the wider ${p.name} market with tailored messaging, landing pages and offers, and exclude wasted clicks from outside your service area.`,
  ],
  seo: (c, p) => [
    `Ranking in ${c.name} means competing against every ${lower(c.industries[0])} and ${lower(c.industries[1])} business fighting for the same map pack and page-one positions. We build location-specific content, optimize your Google Business Profile for ${c.name} and earn links from ${p.name} sources so Google and AI assistants see you as the local authority.`,
    `Searches such as "near me", "${c.name}" and neighbourhood terms like ${list(c.areas.slice(0, 3), 3, "or")} carry strong purchase intent. Our keyword mapping covers each of them with dedicated, genuinely useful pages rather than thin doorway content.`,
    `${c.name} businesses increasingly get discovered through AI answers as well as Google. We structure your site with schema markup, consistent entity data and clear factual content so ChatGPT, Gemini, Claude and Perplexity can cite you when someone in ${c.name} asks for a recommendation.`,
  ],
  "website-development": (c, p) => [
    `A website for a ${c.name} business has to do three things: load instantly on mobile, communicate trust in seconds and make it effortless to call, book or request a quote. We design every page around those outcomes, with the visual quality ${c.name}'s ${lower(c.industries[0])} and ${lower(c.industries[1])} sectors expect.`,
    `Every site we build in ${c.name} ships with technical SEO, structured data and a content management system, so your ${c.name} location pages, blog and portfolio can grow without a developer.${p.bilingual ? ` For ${p.name}, we build fully bilingual French and English sites that respect provincial language requirements.` : ""}`,
    `We integrate the tools ${c.name} businesses actually use: online booking, quote calculators, CRM and email platforms, live chat, payment processing and analytics that show exactly which pages generate enquiries.`,
  ],
  branding: (c, p) => [
    `${c.name} is ${c.descriptor}, and its customers have plenty of choice. A clear, distinctive brand is how ${c.name} businesses in ${lower(c.industries[0])}, ${lower(c.industries[1])} and ${lower(c.industries[2])} stop competing on price and start being chosen on trust.`,
    `We research your ${c.name} competitors, define positioning that owns a specific space in the ${p.name} market and design a logo and identity system that works on a storefront in ${c.areas[0]}, a vehicle on the highway and a phone screen.`,
    `Deliverables cover everything a growing ${c.name} business needs: logo files in every format, colour and typography systems, business cards, signage, social templates, ad creative and a guidelines document your whole team can follow.`,
  ],
};

/* ---------------- FAQ pools ---------------- */
const cityFaqPool: Record<string, (c: City, p: Province, s: Service) => Faq[]> = {
  "lead-generation": (c, p) => [
    { question: `How much does lead generation cost in ${c.name}?`, answer: `Most ${c.name} businesses invest CAD $1,500 to $5,000 per month in advertising plus a flat management fee. Cost per lead in ${c.name} depends on your industry; ${lower(c.industries[0])} and ${lower(c.industries[1])} tend to be more competitive than niche services. We set a target cost per lead with you before launch.` },
    { question: `Which lead generation channels work best in ${c.name}?`, answer: `Google Search captures ${c.name} residents actively looking for your service, while Meta and LinkedIn build demand and retarget visitors. For most ${c.name} businesses we start with Google Ads and local SEO, then layer in social advertising once economics are proven.` },
    { question: `How quickly will I get leads in ${c.name}?`, answer: `Paid campaigns typically deliver the first ${c.name} leads within days of launch. Stable, optimized cost-per-lead numbers usually arrive within 60 to 90 days as we refine targeting across ${list(c.areas, 3)}.` },
    { question: `Can you target specific neighbourhoods in ${c.name}?`, answer: `Yes. We can target or exclude areas such as ${list(c.areas.slice(0, 4), 4)} by radius, postal code or neighbourhood, and adjust bids by location performance.` },
    { question: `Do you work with ${c.name} businesses in my industry?`, answer: `We serve ${c.name} companies across home services, professional services, healthcare, B2B, real estate and more. If your customers search for what you sell, we can build a profitable lead generation system for you.` },
    { question: `Will the leads be exclusive to my business?`, answer: `Yes. Unlike lead marketplaces that sell the same enquiry to several ${c.name} companies, every lead we generate comes through your own ads and landing pages and belongs only to you.` },
    { question: `Do you integrate with my CRM?`, answer: `We connect leads to HubSpot, Salesforce, Pipedrive, GoHighLevel, Jobber, ServiceTitan and most other platforms, and send instant SMS or email alerts to your ${c.name} team.` },
  ],
  seo: (c, p) => [
    { question: `How long does SEO take in ${c.name}?`, answer: `Local and long-tail rankings in ${c.name} often move within 4 to 8 weeks. Competitive terms in ${c.name}'s ${lower(c.industries[0])} and ${lower(c.industries[1])} sectors typically take 4 to 9 months to reach page one. SEO compounds, so results keep growing after that.` },
    { question: `How much does SEO cost in ${c.name}?`, answer: `SEO packages for ${c.name} businesses typically range from CAD $1,200 to $5,000 per month depending on competition, number of locations and content volume. Multi-city campaigns across ${p.name} are scoped individually.` },
    { question: `Can you get my business into the Google map pack in ${c.name}?`, answer: `Yes. We optimize your Google Business Profile, build consistent citations, grow reviews and create ${c.name} location content, which are the main factors Google uses to rank the local three-pack.` },
    { question: `What is AI search optimization and does it matter in ${c.name}?`, answer: `AI search optimization ensures assistants like ChatGPT, Gemini and Perplexity understand and recommend your business. More ${c.name} consumers ask AI for recommendations every month, so we structure your content and entity data to be cited.` },
    { question: `Can you rank my ${c.name} business in nearby cities too?`, answer: `Yes. We build service-area pages for surrounding communities such as ${list(getNearbyCities(c, 3).map((n) => n.name), 3)} so you capture demand across the region, not just ${c.name}.` },
    { question: `Do you write the content?`, answer: `Yes. Our SEO writers produce ${c.name}-specific service pages, blog articles and FAQs that satisfy search intent and read naturally, reviewed by you before publishing.` },
    { question: `Will SEO work for a new ${c.name} business?`, answer: `Absolutely. New businesses benefit from getting technical foundations, local signals and content right from day one, and often outrank established ${c.name} competitors with weak websites within months.` },
  ],
  "website-development": (c, p) => [
    { question: `How much does a website cost in ${c.name}?`, answer: `A professionally designed business website in ${c.name} typically costs CAD $6,000 to $25,000 depending on pages, features and integrations. E-commerce and custom applications range higher. Every project receives a fixed quote after discovery.` },
    { question: `How long does it take to build a website for a ${c.name} business?`, answer: `Most ${c.name} business websites launch in 4 to 8 weeks. Larger e-commerce${p.bilingual ? " or bilingual" : ""} projects take 8 to 14 weeks. Timelines depend mainly on how quickly content and approvals arrive.` },
    { question: `Do you build websites on WordPress, Shopify or custom code?`, answer: `All three. For ${c.name} businesses focused on speed, SEO and leads we recommend Next.js with a headless CMS. WordPress suits content-heavy sites and Shopify suits online stores. We recommend based on your goals.` },
    { question: `Will my ${c.name} website rank on Google?`, answer: `Every site we build includes technical SEO, structured data, fast load times and content architecture designed for ${c.name} search terms. We also handle redirects during redesigns so existing rankings are protected.` },
    { question: `Can I update the website myself?`, answer: `Yes. You receive a modern CMS and training so your ${c.name} team can edit pages, publish blog posts and add projects without code.` },
    { question: `Do you offer hosting and maintenance for ${c.name} clients?`, answer: `Yes. Managed hosting on fast edge infrastructure, security updates, backups and uptime monitoring are available on monthly plans.` },
    { question: `Do you meet with clients in ${c.name}?`, answer: `We work with ${c.name} clients remotely through video calls and a shared project portal, with in-person meetings available for larger ${p.name} engagements.` },
  ],
  branding: (c, p) => [
    { question: `How much does logo design cost in ${c.name}?`, answer: `Professional logo design for ${c.name} businesses typically ranges from CAD $1,500 to $5,000. A complete brand identity with strategy, guidelines and collateral generally ranges from CAD $5,000 to $20,000.` },
    { question: `How long does a branding project take?`, answer: `Logo design takes 2 to 3 weeks; a full brand identity for a ${c.name} business typically takes 3 to 6 weeks including strategy, design rounds and guidelines.` },
    { question: `Do I own my logo and brand files?`, answer: `Yes. You receive vector and raster files in every format plus full rights, so your ${c.name} printers, sign makers and developers have everything they need.` },
    { question: `Can you refresh my existing ${c.name} brand?`, answer: `Yes. A brand refresh modernizes your identity while preserving recognition you have built in ${c.name} over the years.` },
    { question: `Do you design signage and vehicle wraps?`, answer: `Yes. We design storefront signage, vehicle wraps, trade show displays and print collateral to specification for ${c.name} and ${p.name} print partners.` },
    { question: `Do you offer ongoing graphic design?`, answer: `Many ${c.name} clients retain us monthly for social media graphics, ads, brochures and presentations with 48 to 72 hour turnaround.` },
    { question: `How does branding help my ${c.name} business grow?`, answer: `A recognizable brand earns more clicks in search, higher conversion rates on landing pages, stronger word of mouth and the ability to charge premium prices in ${c.name}'s competitive market.` },
  ],
};

function pickFaqs(pool: Faq[], seed: string, count = 5): Faq[] {
  const start = hash(seed) % pool.length;
  const out: Faq[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) out.push(pool[(start + i) % pool.length]);
  return out;
}

/* ---------------- Service × City ---------------- */
export type LocationPageContent = {
  h1: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string[];
  angles: string[];
  whySection: { title: string; paragraphs: string[] };
  industries: { title: string; text: string }[];
  faqs: Faq[];
  keyFacts: string[];
  nearby: City[];
  siblingServices: Service[];
  subServices: Service[];
};

export function serviceCityContent(service: Service, city: City): LocationPageContent {
  const province = getProvince(city.province)!;
  const seed = `${service.slug}:${city.slug}`;
  const nearby = getNearbyCities(city, 6);

  const h1Variants = [
    `${service.name} in ${city.name}, ${province.code}`,
    `${service.name} Services in ${city.name}`,
    `${city.name} ${service.name} Agency`,
  ];
  const h1 = pick(h1Variants, seed);

  const introVariants = [
    `${site.name} provides ${service.noun} for businesses in ${city.name}, ${province.name}. ${city.name} is ${city.descriptor}, with a population of about ${city.population} and an economy driven by ${list(city.industries.map(lower), 3)}. Whether you serve customers in ${list(city.areas.slice(0, 3), 3, "or")}, our team builds ${service.noun} programs designed for how people in ${city.name} actually search, compare and buy.`,
    `Looking for ${service.noun} in ${city.name}? ${site.name} is a Canadian agency helping ${city.name} companies grow through ${service.noun} that is measured on results, not activity. ${city.name} is ${city.fact}, and its ${list(city.industries.map(lower), 2)} businesses compete in one of ${province.name}'s most active markets. We help you win that competition.`,
    `${city.name} businesses choose ${site.name} for ${service.noun} because we combine strategy, execution and transparent reporting in one team. With roughly ${city.population} residents and strong ${list(city.industries.map(lower), 3)} sectors, ${city.name} offers real growth potential for companies whose ${service.noun} is done right.`,
  ];

  const angles = (localAngles[service.slug] ?? localAngles.seo)(city, province);

  const whyParas = [
    `${city.name} is ${city.fact}. That momentum brings opportunity, but also competition: more ${lower(city.industries[0])} and ${lower(city.industries[1])} companies are investing in digital growth every year. ${service.name} from ${site.name} gives you an edge with ${pick(["a disciplined, data-driven process", "senior specialists on every account", "a system built around your cost of acquisition", "strategy tailored to the local market"], seed, 1)}.`,
    `We already understand the ${province.name} market: ${province.economy} ${province.bilingual ? "Our bilingual team produces French and English assets so you reach every customer segment." : "Our work across the province means we know what resonates with local buyers."}`,
    `Everything we deliver in ${city.name} is tied to outcomes you can see: enquiries, booked appointments, quotes and revenue. You will always know what your ${service.noun} investment returns.`,
  ];

  const industries = city.industries.slice(0, 4).map((ind) => ({
    title: `${ind} in ${city.name}`,
    text: industryBlurb(service, ind, city),
  }));

  const faqs = pickFaqs(cityFaqPool[service.slug]?.(city, province, service) ?? [], seed, 5);

  const keyFacts = [
    `${site.name} offers ${service.noun} to businesses in ${city.name}, ${province.name}, Canada.`,
    `${city.name} has a population of approximately ${city.population} and is ${city.descriptor}.`,
    `Core services available in ${city.name}: ${coreServices.map((s) => s.name).join(", ")}.`,
    `Service area includes ${list(city.areas, 5)} and nearby ${list(nearby.slice(0, 3).map((n) => n.name), 3)}.`,
    `Contact: ${site.email}${site.phone ? ` or ${site.phone}` : ""}.`,
  ];

  return {
    h1,
    title: `${service.name} ${city.name} | ${service.shortName} Agency in ${city.name}, ${province.code} | ${site.name}`,
    description: `${service.name} services in ${city.name}, ${province.name}. ${site.name} helps ${city.name} businesses grow with ${service.noun}: ${service.deliverables.slice(0, 3).map(lower).join(", ")}. Free consultation.`,
    eyebrow: `${service.name} · ${city.name}, ${province.code}`,
    intro: [pick(introVariants, seed)],
    angles,
    whySection: { title: `Why ${city.name} businesses choose ${site.name} for ${service.noun}`, paragraphs: whyParas },
    industries,
    faqs,
    keyFacts,
    nearby,
    siblingServices: coreServices.filter((s) => s.slug !== service.slug),
    subServices: getSubServices(service.slug),
  };
}

function industryBlurb(service: Service, industry: string, city: City): string {
  const ind = lower(industry);
  const map: Record<string, string> = {
    "lead-generation": `${industry} companies in ${city.name} need a steady flow of qualified enquiries. We build search and social campaigns tailored to how ${ind} buyers research, with landing pages and follow-up designed to convert.`,
    seo: `${industry} is a competitive search category in ${city.name}. We map the questions ${ind} buyers ask, build authoritative content and local signals, and track rankings for the terms that drive revenue.`,
    "website-development": `Websites for ${ind} businesses in ${city.name} must communicate credibility and make contact effortless. We design industry-appropriate layouts, integrate booking or quoting tools and optimize every page for speed.`,
    branding: `In ${city.name}'s ${ind} sector, a polished brand signals reliability before a single conversation. We create identities that look established, trustworthy and distinctly yours.`,
  };
  return map[service.slug] ?? map.seo;
}

/* ---------------- Service × Province ---------------- */
export function serviceProvinceContent(service: Service, province: Province) {
  const cities = getCitiesInProvince(province.slug);
  const seed = `${service.slug}:${province.slug}`;
  const h1 = pick([`${service.name} in ${province.name}`, `${service.name} Services Across ${province.name}`, `${province.name} ${service.name} Agency`], seed);
  const intro = [
    `${site.name} delivers ${service.noun} to businesses across ${province.name}, from ${province.largestCity} to ${list(cities.filter((c) => c.name !== province.largestCity).slice(0, 3).map((c) => c.name), 3)}. ${province.economy} With a population of about ${province.population}, ${province.name} is a market where well-executed ${service.noun} produces measurable, compounding growth.`,
    `Our ${province.name} work spans ${list(province.industries.map(lower), 4)}. We tailor strategy to each regional market, because what works in ${province.largestCity} rarely translates directly to smaller centres. ${province.bilingual ? `Because ${province.name} is bilingual, we produce French and English content, campaigns and design as standard.` : ""}`,
  ];
  const faqs: Faq[] = [
    { question: `Do you offer ${service.noun} throughout ${province.name}?`, answer: `Yes. We serve businesses in every part of ${province.name} including ${list(cities.map((c) => c.name), 5)} and surrounding communities. Our team works remotely with clients across the province.` },
    { question: `How is ${service.noun} different in ${province.name}?`, answer: `${province.name}'s economy is shaped by ${list(province.industries.map(lower), 3)}, which affects competition, search behaviour and buyer expectations. We localize strategy for each regional market rather than applying a national template.` },
    { question: `Can you help a multi-location business across ${province.name}?`, answer: `Absolutely. We build location-specific pages, campaigns and profiles for every city you serve while keeping brand, reporting and strategy unified.` },
    { question: `What does ${service.noun} cost in ${province.name}?`, answer: `Pricing depends on scope and competition. ${service.faqs[0]?.answer ?? "Contact us for a fixed quote after a free consultation."}` },
    ...(province.bilingual ? [{ question: `Do you provide French-language ${service.noun}?`, answer: `Yes. We produce bilingual French and English deliverables and understand the language requirements that apply to businesses operating in ${province.name}.` }] : []),
  ];
  return {
    h1,
    title: `${service.name} ${province.name} | ${service.shortName} Services in ${province.code} | ${site.name}`,
    description: `${service.name} services across ${province.name}. ${site.name} helps businesses in ${list(cities.slice(0, 4).map((c) => c.name), 4)} and all of ${province.code} grow with expert ${service.noun}.`,
    intro,
    cities,
    faqs,
    keyFacts: [
      `${site.name} offers ${service.noun} across ${province.name} (${province.code}), Canada.`,
      `${province.name} population: approximately ${province.population}. Capital: ${province.capital}. Largest city: ${province.largestCity}.`,
      `Cities served include ${list(cities.map((c) => c.name), cities.length)}.`,
    ],
  };
}

/* ---------------- Service × Canada ---------------- */
export function serviceCountryContent(service: Service) {
  return {
    h1: `${service.name} Services in Canada`,
    title: `${service.name} Canada | Canadian ${service.shortName} Agency | ${site.name}`,
    description: `${service.name} for businesses across Canada. ${site.name} is a Canadian agency serving all provinces and territories with ${service.noun} that delivers measurable results.`,
    intro: [
      `${site.name} is a Canadian agency providing ${service.noun} to businesses in every province and territory, from British Columbia to Newfoundland and Labrador. Canada's 40 million consumers and 1.2 million small and medium businesses shop, research and hire online, and ${service.noun} is how you reach them at the right moment.`,
      `Canadian markets differ enormously: bilingual Quebec, resource-driven Alberta, tech-heavy Ontario and BC, and tight-knit Atlantic and Northern communities. We localize ${service.noun} for each, while keeping strategy, brand and reporting unified for national or multi-province companies.`,
    ],
    keyFacts: [
      `${site.name} provides ${service.noun} nationwide in Canada.`,
      `Headquartered in ${site.hq.city}, ${site.hq.province}; serving all 10 provinces and 3 territories.`,
      `Bilingual (English and French) deliverables available.`,
    ],
    faqs: [
      { question: `Do you provide ${service.noun} across all of Canada?`, answer: `Yes. We serve clients in every province and territory and work remotely with teams from coast to coast.` },
      { question: `Can you handle French and English?`, answer: `Yes. We produce bilingual deliverables for Quebec, New Brunswick and national campaigns.` },
      { question: `Do you understand Canadian regulations?`, answer: `We work within CASL (anti-spam), PIPEDA and provincial privacy law, Quebec's language requirements and platform policies specific to Canadian advertisers.` },
      ...service.faqs.slice(0, 3),
    ],
  };
}

/* ---------------- City & Province hub pages ---------------- */
export function cityHubContent(city: City) {
  const province = getProvince(city.province)!;
  const nearby = getNearbyCities(city, 6);
  return {
    h1: `Digital Marketing Agency in ${city.name}, ${province.code}`,
    title: `Digital Marketing Agency ${city.name} | SEO, Lead Gen, Web Design & Branding | ${site.name}`,
    description: `${site.name} is a digital growth agency serving ${city.name}, ${province.name}. Lead generation, SEO, website development and branding for ${city.name} businesses.`,
    intro: [
      `${site.name} helps businesses in ${city.name} grow with lead generation, SEO, website development and branding. ${city.name} is ${city.descriptor}, home to roughly ${city.population} people and ${city.fact}. Its ${list(city.industries.map(lower), 3)} sectors make it one of ${province.name}'s most dynamic markets, and one where the businesses that show up first online win.`,
      `From ${list(city.areas.slice(0, 4), 4)}, ${city.name} companies rely on us to be found on Google, recommended by AI assistants, and chosen over the competition. Below is everything we offer in ${city.name}.`,
    ],
    province,
    nearby,
    faqs: [
      { question: `What services does ${site.name} offer in ${city.name}?`, answer: `We offer lead generation (Google Ads, social advertising, landing pages), SEO and local SEO, website design and development, and branding including logo design and graphic design for ${city.name} businesses.` },
      { question: `Do you have an office in ${city.name}?`, answer: `We serve ${city.name} clients remotely from ${site.hq.city} with video meetings and a shared project portal, and can arrange in-person meetings for larger engagements in ${province.name}.` },
      { question: `Which industries do you serve in ${city.name}?`, answer: `We work with ${city.name} businesses in ${list(city.industries.map(lower), city.industries.length)} and many more, from solo practices to multi-location companies.` },
      { question: `How do I get started?`, answer: `Request a free consultation. We will review your current digital presence in ${city.name} and recommend the highest-impact next steps within two business days.` },
    ],
    keyFacts: [
      `${site.name} is a digital marketing agency serving ${city.name}, ${province.name}, Canada.`,
      `Services: Lead Generation, SEO, Website Development, Branding & Graphic Design.`,
      `${city.name} population: about ${city.population}. Key industries: ${list(city.industries, 4)}.`,
    ],
  };
}

export function provinceHubContent(province: Province) {
  const cities = getCitiesInProvince(province.slug);
  return {
    h1: `Digital Marketing Agency in ${province.name}`,
    title: `Digital Marketing Agency ${province.name} | SEO, Lead Generation, Web Design | ${site.name}`,
    description: `${site.name} serves businesses across ${province.name} with lead generation, SEO, website development and branding. Cities include ${list(cities.slice(0, 4).map((c) => c.name), 4)}.`,
    intro: [
      `${site.name} is a Canadian digital growth agency serving businesses throughout ${province.name}. ${province.economy} With about ${province.population} residents and strengths in ${list(province.industries.map(lower), 4)}, ${province.name} rewards companies that invest in visibility, conversion and brand.`,
      `We provide lead generation, SEO, website development and branding to ${province.name} businesses in ${list(cities.map((c) => c.name), Math.min(cities.length, 6))}${cities.length > 6 ? " and beyond" : ""}. ${province.bilingual ? "All deliverables are available in both French and English." : ""}`,
    ],
    cities,
    faqs: [
      { question: `Which cities in ${province.name} do you serve?`, answer: `We serve every community in ${province.name}, with dedicated pages for ${list(cities.map((c) => c.name), cities.length)}.` },
      { question: `What services are available in ${province.name}?`, answer: `Lead generation, SEO, website development and branding, plus Google Ads, social media advertising, local SEO, e-commerce development, logo design and graphic design.` },
      { question: `Do you work with small businesses in ${province.name}?`, answer: `Yes. Our clients range from solo professionals and local trades to multi-location companies and national brands.` },
    ],
    keyFacts: [
      `${site.name} provides digital marketing services across ${province.name} (${province.code}), Canada.`,
      `Capital: ${province.capital}. Largest city: ${province.largestCity}. Population: about ${province.population}.`,
    ],
  };
}
