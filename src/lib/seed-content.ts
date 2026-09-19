import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedPosts } from "./seed-posts";

export async function ensureAdmin(prisma: PrismaClient, email?: string, password?: string) {
  const e = (email || process.env.ADMIN_EMAIL || "admin@betterbusinesses.ca").toLowerCase();
  const p = password || process.env.ADMIN_PASSWORD || "change-me-now";
  return prisma.user.upsert({ where: { email: e }, update: {}, create: { email: e, name: "Admin", passwordHash: await bcrypt.hash(p, 12) } });
}

/** Inserts sample testimonials, logos, projects, posts and FAQs when those tables are empty. Idempotent. */
export async function seedStarterContent(prisma: PrismaClient) {
  const created: string[] = [];
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "Priya Raman", role: "Owner", company: "Maple Ridge Dental", location: "Mississauga, ON", quote: "Within four months our Google Ads cost per booking dropped by 41% and we had to hire a second hygienist. Better Businesses tracks everything and tells us exactly what is working.", rating: 5, service: "lead-generation", featured: true, sortOrder: 1 },
        { name: "Marc-André Gagnon", role: "Directeur général", company: "Gagnon Rénovations", location: "Laval, QC", quote: "They rebuilt our website in French and English, and we now rank on page one for renovation searches across Laval and Montreal. Leads come in every single day.", rating: 5, service: "website-development", featured: true, sortOrder: 2 },
        { name: "Sarah Whitfield", role: "Marketing Director", company: "Northwind Heating & Cooling", location: "Calgary, AB", quote: "Our organic traffic tripled in a year and, honestly, the part that surprised us was seeing our company recommended in ChatGPT answers. That is the AI search work paying off.", rating: 5, service: "seo", featured: true, sortOrder: 3 },
        { name: "Daniel Okafor", role: "Founder", company: "Harbourline Legal", location: "Halifax, NS", quote: "The brand identity they created makes us look like the established firm we are. Referrals mention the website and the branding constantly.", rating: 5, service: "branding", sortOrder: 4 },
        { name: "Jennifer Liu", role: "CEO", company: "Pacific Peak Realty", location: "Vancouver, BC", quote: "Clear reporting, senior people who actually pick up the phone, and results we can bank on. We consolidated three vendors into Better Businesses.", rating: 5, sortOrder: 5 },
        { name: "Tom Bergeron", role: "Owner", company: "Bergeron Electrical", location: "Winnipeg, MB", quote: "I was skeptical of agencies. Six months later we are booked three weeks out and I know the cost of every lead to the dollar.", rating: 5, service: "google-ads", sortOrder: 6 },
      ],
    });
    created.push("testimonials");
  }

  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "northwind-hvac-seo-lead-generation",
          title: "3.1x more booked jobs for a Calgary HVAC company",
          client: "Northwind Heating & Cooling",
          industry: "Home services",
          location: "Calgary, AB",
          services: "seo,lead-generation,google-ads",
          summary: "A full-funnel rebuild combining local SEO, Google Ads and conversion-optimized landing pages turned a seasonal business into a year-round lead machine.",
          challenge: "Northwind relied on word of mouth and a dated website that took six seconds to load on mobile. Winter demand spiked but summer was quiet, and their previous agency reported clicks, not jobs.",
          solution: "We rebuilt the site on Next.js with service-area pages for Calgary, Airdrie and Okotoks, optimized their Google Business Profile, launched tightly structured Search campaigns with call tracking and added an AC-focused summer offer with retargeting.\n\n- 22 service and location pages with FAQ schema\n- Google Ads restructured around intent clusters\n- Review-generation system that added 140+ reviews in a year",
          results: JSON.stringify([{ label: "Booked jobs", value: "3.1x" }, { label: "Cost per lead", value: "-42%" }, { label: "Organic traffic", value: "+212%" }]),
          testimonial: "Our organic traffic tripled in a year and we're now recommended in AI answers. That is the AI search work paying off.",
          testimonialBy: "Sarah Whitfield, Marketing Director",
          accentColor: "#C19A3E",
          published: true,
          featured: true,
          sortOrder: 1,
          completedAt: new Date("2025-11-01"),
        },
        {
          slug: "gagnon-renovations-bilingual-website",
          title: "A bilingual website that ranks across Laval and Montreal",
          client: "Gagnon Rénovations",
          industry: "Construction",
          location: "Laval, QC",
          services: "website-development,seo,branding",
          summary: "French-first, English-ready: a fast bilingual website with a refreshed identity that now generates daily renovation enquiries.",
          challenge: "Gagnon's old site was French-only, slow and invisible in search. English-speaking homeowners in the West Island never found them.",
          solution: "We refreshed the logo and colour system, designed a portfolio-led site with before-and-after galleries, built hreflang-correct French and English versions and structured every service page for local search.",
          results: JSON.stringify([{ label: "Page-one keywords", value: "180+" }, { label: "Enquiries per month", value: "+165%" }, { label: "PageSpeed score", value: "98" }]),
          accentColor: "#9A7628",
          published: true,
          featured: true,
          sortOrder: 2,
          completedAt: new Date("2025-08-15"),
        },
        {
          slug: "harbourline-legal-brand-identity",
          title: "A premium identity for a growing Halifax law firm",
          client: "Harbourline Legal",
          industry: "Legal",
          location: "Halifax, NS",
          services: "branding,logo-design,graphic-design",
          summary: "Brand strategy, logo, stationery, signage and a template system that made a three-year-old firm look like an institution.",
          challenge: "Harbourline was winning complex cases but losing pitches to older firms on perception alone.",
          solution: "Positioning workshops led to a confident, maritime-inspired identity. We delivered a full logo system, typography and colour palette, business cards, letterhead, pitch deck, office signage and LinkedIn templates, plus a 40-page brand guide.",
          results: JSON.stringify([{ label: "Logo concepts", value: "4" }, { label: "Timeline", value: "5 wk" }, { label: "Referral mentions of brand", value: "Weekly" }]),
          accentColor: "#1C1C1C",
          published: true,
          featured: true,
          sortOrder: 3,
          completedAt: new Date("2025-05-20"),
        },
        {
          slug: "maple-ridge-dental-google-ads",
          title: "41% lower cost per booking for a Mississauga dental clinic",
          client: "Maple Ridge Dental",
          industry: "Healthcare",
          location: "Mississauga, ON",
          services: "google-ads,lead-generation,social-media-advertising",
          summary: "Restructured Google Ads, Meta retargeting and a dedicated booking landing page delivered predictable new-patient growth.",
          challenge: "Broad-match campaigns were burning budget on irrelevant searches, and the clinic's homepage was the only landing page.",
          solution: "We rebuilt campaigns by procedure (implants, Invisalign, emergency), added negative keyword hygiene, created procedure-specific landing pages with online booking and layered Meta retargeting with patient-story creative.",
          results: JSON.stringify([{ label: "Cost per booking", value: "-41%" }, { label: "New patients / month", value: "+68%" }, { label: "Wasted spend removed", value: "27%" }]),
          accentColor: "#E3C97F",
          published: true,
          sortOrder: 4,
          completedAt: new Date("2026-02-10"),
        },
      ],
    });
    created.push("projects");
  }

  // Blog posts: add any starter article whose slug is missing, and refresh starter articles that have
  // never been edited in the admin (updatedAt still equals createdAt) so improved copy reaches existing sites.
  const existingPosts = await prisma.post.findMany({ select: { slug: true, createdAt: true, updatedAt: true } });
  const bySlug = new Map(existingPosts.map((p) => [p.slug, p]));
  let added = 0;
  let refreshed = 0;
  for (const p of seedPosts) {
    const data = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      tags: p.tags,
      author: "Better Businesses",
      readingMinutes: p.readingMinutes,
      seoTitle: p.seoTitle ?? null,
      seoDescription: p.seoDescription,
      faqs: p.faqs?.length ? JSON.stringify(p.faqs) : null,
      published: true,
      featured: p.featured ?? false,
      publishedAt: new Date(p.publishedAt),
    };
    const ex = bySlug.get(p.slug);
    if (!ex) {
      await prisma.post.create({ data });
      added++;
    } else if (Math.abs(ex.updatedAt.getTime() - ex.createdAt.getTime()) < 2000) {
      // keep the "never edited" marker so future refreshes still apply
      await prisma.post.update({ where: { slug: p.slug }, data: { ...data, updatedAt: ex.createdAt } });
      refreshed++;
    }
  }
  if (added) created.push(`${added} blog post${added === 1 ? "" : "s"}`);
  if (refreshed) created.push(`${refreshed} refreshed article${refreshed === 1 ? "" : "s"}`);

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: [
        { question: "Do you work with businesses outside of Ontario?", answer: "Yes. We serve clients in every province and territory and deliver in both English and French.", category: "general", sortOrder: 1 },
        { question: "Can you take over from our current agency?", answer: "Yes. We audit existing accounts and websites, migrate everything into accounts you own and ensure no rankings or data are lost in the transition.", category: "general", sortOrder: 2 },
      ],
    });
    created.push("FAQs");
  }
  return created;
}
