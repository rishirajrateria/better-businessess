import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  if ((await prisma.post.count()) === 0) {
    await prisma.post.createMany({
      data: [
        {
          slug: "ai-search-optimization-guide-canadian-businesses",
          title: "AI Search Optimization: How Canadian Businesses Get Recommended by ChatGPT, Gemini and Perplexity",
          excerpt: "Customers increasingly ask AI assistants for recommendations. Here is the practical playbook for making sure your business is the one they name.",
          category: "SEO",
          tags: "AI search, GEO, AEO, ChatGPT, Gemini, Perplexity, SEO Canada",
          author: "Better Businesses",
          readingMinutes: 9,
          published: true,
          featured: true,
          publishedAt: new Date("2026-06-02"),
          seoTitle: "AI Search Optimization Guide for Canadian Businesses (2026)",
          seoDescription: "Learn how to get your Canadian business recommended by ChatGPT, Gemini, Claude and Perplexity with entity SEO, structured data, llms.txt and citation strategy.",
          faqs: JSON.stringify([
            { question: "What is AI search optimization?", answer: "AI search optimization (also called GEO or AEO) is the practice of structuring your website, content and brand information so AI assistants can understand, trust and cite your business when users ask for recommendations." },
            { question: "Does AI search optimization replace SEO?", answer: "No. It builds on SEO. AI models rely heavily on the same signals Google uses: crawlable content, authority, structured data and consistent entity information." },
            { question: "How long does it take to appear in AI answers?", answer: "Brands with strong existing authority can appear within weeks of structuring their content. New brands typically need 3 to 6 months of consistent publishing and citation building." },
          ]),
          content: `## Why AI search matters now

A growing share of Canadians start their buying journey by asking an AI assistant: "Who is the best SEO agency in Toronto?" or "Recommend a plumber in Calgary that does emergency calls." These answers are generated from what the model has learned about businesses and, increasingly, from live web retrieval. If your business is not clearly described, structured and cited online, you are invisible in that conversation.

AI search optimization (sometimes called generative engine optimization or answer engine optimization) is the discipline of making your business easy for models to understand, trust and recommend. The good news: most of it overlaps with excellent SEO.

## 1. Be an unambiguous entity

Models reason about *entities*: a business with a name, location, services and relationships. Make yours unmistakable.

- Use one consistent name, address and phone number everywhere: website, Google Business Profile, directories, social profiles.
- Publish an About page that states plainly what you do, where you do it and who you serve.
- Add **Organization** and **LocalBusiness** schema with \`sameAs\` links to every official profile.
- Register in authoritative directories and industry associations.

## 2. Answer questions directly

AI assistants favour content that answers a question in the first sentence. Write pages and FAQs that lead with the answer, then elaborate.

- Add FAQ sections with **FAQPage** schema to service and location pages.
- Include specific facts: prices, timelines, service areas, deliverables.
- Use plain, factual sentences models can quote verbatim.

## 3. Publish an llms.txt file

The emerging \`/llms.txt\` standard gives models a concise, structured map of your site. Include your description, core services, locations, pricing guidance and links to key pages. Our own file is at [/llms.txt](/llms.txt).

## 4. Welcome AI crawlers

Check your robots.txt. Many sites accidentally block GPTBot, ClaudeBot, PerplexityBot or Google-Extended. If you want to be recommended, you need to be readable.

## 5. Earn citations, not just links

Models weigh mentions from authoritative sources: news outlets, industry publications, review platforms, local chambers of commerce. A digital PR program that earns brand mentions builds the kind of consensus AI systems trust.

## 6. Build local proof

Reviews with specific details ("they installed our furnace in Airdrie within 24 hours") teach models what you do and where. Encourage them systematically.

## 7. Measure it

Track branded search volume, referral traffic from AI tools (chat.openai.com, perplexity.ai, gemini.google.com) in your analytics, and periodically ask the assistants your key questions to see who they recommend.

## Where to start

If you do nothing else this quarter: fix your entity data, add FAQ schema to your top ten pages, publish llms.txt and unblock AI crawlers. Then keep publishing genuinely helpful content. That is exactly how we structure every client site at Better Businesses.`,
        },
        {
          slug: "how-much-does-a-website-cost-in-canada",
          title: "How Much Does a Business Website Cost in Canada in 2026?",
          excerpt: "Real price ranges for Canadian business websites, what drives the cost, and how to tell a $4,000 site from a $40,000 one.",
          category: "Web Design",
          tags: "website cost, web design pricing, Canada, small business",
          author: "Better Businesses",
          readingMinutes: 7,
          published: true,
          publishedAt: new Date("2026-04-14"),
          seoTitle: "How Much Does a Website Cost in Canada? 2026 Pricing Guide",
          seoDescription: "Canadian website pricing explained: brochure sites, lead-generation sites, e-commerce and custom builds, with typical CAD ranges and what affects the price.",
          faqs: JSON.stringify([
            { question: "How much does a small business website cost in Canada?", answer: "A professionally designed small business website in Canada typically costs CAD $6,000 to $15,000. Larger lead-generation sites with many service and location pages range from $15,000 to $30,000." },
            { question: "Is a cheap website worth it?", answer: "Template sites under $2,000 can work as a placeholder, but they rarely load fast, rank well or convert. For a business that depends on leads, the website is a revenue asset worth investing in." },
          ]),
          content: `## The short answer

| Type of website | Typical cost (CAD) | Timeline |
| --- | --- | --- |
| Brochure site (5–8 pages) | $4,000 – $8,000 | 3–5 weeks |
| Lead-generation site (15–40 pages, SEO-ready) | $8,000 – $25,000 | 5–8 weeks |
| E-commerce store | $10,000 – $40,000 | 6–12 weeks |
| Custom web application | $30,000+ | 10+ weeks |

## What actually drives the price

**Strategy and content.** Cheap sites skip this. Good agencies research your customers, map pages to search intent and write copy that converts. Content is frequently half the effort.

**Design quality.** Custom design that reflects your brand costs more than a template, and it shows in trust and conversion rates.

**Performance engineering.** A site that scores 95+ on Core Web Vitals requires modern frameworks, image optimization and clean code.

**SEO foundations.** Schema markup, internal linking, clean URLs, redirects from an old site and location pages all add scope, and all add leads.

**Integrations.** Booking systems, CRMs, quote calculators, payment processors and bilingual content increase complexity.

## Red flags in low quotes

- No discovery or strategy phase
- A template with your logo swapped in
- Stock copy, no keyword research
- No mention of speed, schema or analytics
- Ongoing "hosting" fees that lock you in with no ownership

## How Better Businesses prices websites

Every project is fixed-price after a discovery call. You own the code, the design files and the content. Most of our lead-generation sites land between $9,000 and $20,000 and pay for themselves within months through organic and paid leads. [Request a quote](/contact) and we will scope it properly.`,
        },
        {
          slug: "google-ads-vs-seo-canadian-small-business",
          title: "Google Ads vs SEO: Which Should a Canadian Small Business Invest in First?",
          excerpt: "Both channels win in different situations. Here is a decision framework based on cash flow, competition and timeline.",
          category: "Lead Generation",
          tags: "Google Ads, SEO, PPC, small business marketing, Canada",
          author: "Better Businesses",
          readingMinutes: 6,
          published: true,
          publishedAt: new Date("2026-03-03"),
          seoDescription: "Google Ads delivers leads now; SEO compounds over time. Learn which to start with based on your budget, market and goals, with Canadian cost benchmarks.",
          content: `## Two engines, different fuel

**Google Ads** buys visibility instantly. You choose the keywords, the cities and the budget, and leads arrive within days. Stop paying and the leads stop.

**SEO** earns visibility over months. It costs effort up front, but once you rank, every click is free and the asset keeps appreciating.

## Start with Google Ads if…

- You need revenue this quarter
- Your market has clear, high-intent searches ("emergency plumber Ottawa")
- You can handle more customers immediately
- Your website already converts reasonably well

## Start with SEO if…

- Your cost per click is brutal (legal, finance, insurance)
- You are planning for 12+ months
- Your competitors have weak websites and few reviews
- You serve many cities and can build location pages

## What most Canadian businesses should actually do

Run both, in sequence. Launch Google Ads with a controlled budget to generate cash flow and, crucially, *data* about which keywords and offers convert. Feed that data into your SEO content plan so you rank for the terms already proven to make money. Over 6 to 12 months, organic leads grow and you can reduce paid dependence.

## Canadian cost benchmarks

- Google Ads management: CAD $800 – $2,500/month plus ad spend of $1,500 – $10,000
- SEO retainers: CAD $1,200 – $5,000/month
- Blended cost per lead after 12 months of both: typically 30–50% lower than ads alone

Not sure which fits? [Get a free growth audit](/contact) and we will tell you honestly.`,
        },
      ],
    });
    created.push("blog posts");
  }

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
