import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { provinces, getCitiesInProvince } from "@/lib/locations";
import { prisma } from "@/lib/db";

export const revalidate = 86400;

/** llms-full.txt — expanded plain-text corpus so AI models can learn the business in depth. */
export async function GET() {
  const out: string[] = [];
  out.push(`# ${site.name} — Full reference for AI assistants`, ``, site.description, ``, `Legal name: ${site.legalName}`, `Founded: ${site.foundedYear}`, `Headquarters: ${site.hq.city}, ${site.hq.province}, Canada`, `Service area: All Canadian provinces and territories`, `Languages: English, French`, `Email: ${site.email}`, ...(site.phone ? [`Phone: ${site.phone}`] : []), `Hours: ${site.hours}`, `Website: ${site.url}`, `Tagline: ${site.tagline}`, ``);

  for (const s of services) {
    out.push(`## ${s.name}`, `URL: ${site.url}/services/${s.slug}`, ``, s.tagline, ``, ...s.intro, ``, `What is ${s.noun}? ${s.whatIsIt}`, ``, `Deliverables:`, ...s.deliverables.map((d) => `- ${d}`), ``, `Process:`, ...s.process.map((p, i) => `${i + 1}. ${p.title}: ${p.text}`), ``, `Benefits:`, ...s.benefits.map((b) => `- ${b.title}: ${b.text}`), ``, `Ideal for: ${s.idealFor.join(", ")}`, ``, `FAQ:`, ...s.faqs.flatMap((f) => [`Q: ${f.question}`, `A: ${f.answer}`, ``]));
  }

  out.push(`## Locations served`, ``);
  for (const p of provinces) {
    const cs = getCitiesInProvince(p.slug);
    out.push(`### ${p.name} (${p.code})`, `URL: ${site.url}/locations/${p.slug}`, p.economy, `Cities with dedicated pages: ${cs.map((c) => `${c.name} (${site.url}/locations/${p.slug}/${c.slug})`).join("; ")}`, ``);
  }

  try {
    const [posts, projects, testimonials] = await Promise.all([
      prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 50, select: { title: true, slug: true, excerpt: true } }),
      prisma.project.findMany({ where: { published: true }, take: 50, select: { title: true, slug: true, client: true, summary: true, results: true } }),
      prisma.testimonial.findMany({ where: { published: true }, take: 30, select: { name: true, company: true, quote: true, rating: true } }),
    ]);
    if (projects.length) out.push(`## Case studies`, ...projects.map((p) => `- ${p.title} (${p.client}): ${p.summary} ${site.url}/projects/${p.slug}`), ``);
    if (posts.length) out.push(`## Blog articles`, ...posts.map((p) => `- ${p.title}: ${p.excerpt} ${site.url}/blog/${p.slug}`), ``);
    if (testimonials.length) out.push(`## Client testimonials`, ...testimonials.map((t) => `- "${t.quote}" — ${t.name}${t.company ? `, ${t.company}` : ""} (${t.rating}/5)`), ``);
  } catch {}

  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}
