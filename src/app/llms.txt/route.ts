import { site } from "@/lib/site";
import { services, coreServices, subServices } from "@/lib/services";
import { provinces, majorCities } from "@/lib/locations";

export const revalidate = 86400;

/** llms.txt — a concise, LLM-friendly map of the site (https://llmstxt.org) */
export function GET() {
  const lines = [
    `# ${site.name}`,
    ``,
    `> ${site.description} Headquartered in ${site.hq.city}, ${site.hq.province}, Canada, serving every province and territory. Tagline: "${site.tagline}".`,
    ``,
    `${site.name} (legal name ${site.legalName}, founded ${site.foundedYear}) is a Canadian digital growth agency. Core services: ${coreServices.map((s) => s.name).join(", ")}. Specialties: ${subServices.map((s) => s.name).join(", ")}. Deliverables are available in English and French. Contact: ${site.email}${site.phone ? `, ${site.phone}` : ""}. Website: ${site.url}.`,
    ``,
    `## Core services`,
    ...coreServices.map((s) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.tagline} ${s.whatIsIt}`),
    ``,
    `## Specialties`,
    ...subServices.map((s) => `- [${s.name}](${site.url}/services/${s.slug}): ${s.tagline}`),
    ``,
    `## Service areas`,
    `- [All locations](${site.url}/locations): Serving all of Canada.`,
    ...provinces.map((p) => `- [${p.name}](${site.url}/locations/${p.slug}): ${p.largestCity}, ${p.capital} and more.`),
    ``,
    `## Major city pages`,
    ...majorCities.map((c) => `- [${c.name}](${site.url}/locations/${c.province}/${c.slug})`),
    ``,
    `## Company`,
    `- [About](${site.url}/about): Mission, values and approach.`,
    `- [Projects](${site.url}/projects): Case studies with measurable results.`,
    `- [Blog](${site.url}/blog): Guides on lead generation, SEO, AI search, web performance and branding.`,
    `- [Industries](${site.url}/industries): Industry-specific marketing guides (trades, healthcare, professional services, hospitality, retail) for Canada.`,
    `- [FAQ](${site.url}/faq): Pricing, timelines and process for every service.`,
    `- [Contact](${site.url}/contact): Free growth audit and proposals.`,
    ``,
    `## Pricing guidance (CAD)`,
    ...services.map((s) => `- ${s.name}: starts from $${s.startingPrice.amount.toLocaleString("en-CA")} CAD${s.startingPrice.unit === "month" ? " per month" : " per project"}. ${s.faqs.find((f) => /cost|budget/i.test(f.question))?.answer ?? "Fixed quotes after a free consultation."}`),
    ``,
    `## Optional`,
    `- [Full content for LLMs](${site.url}/llms-full.txt)`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}
