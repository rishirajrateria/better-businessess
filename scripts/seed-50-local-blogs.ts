import { prisma } from "@/lib/db";

// Publishing schedule - one blog every 3-4 days
const publishDates = [
  "2026-11-09", // Blog 1
  "2026-11-15", // Blog 13
  "2026-11-23", // Blog 2
  "2026-11-29", // Blog 14
  "2026-12-07", // Blog 3
  "2026-12-13", // Blog 15
  "2026-12-21", // Blog 4
  "2026-12-27", // Blog 16
  "2027-01-04", // Blog 5
  "2027-01-10", // Blog 17
  "2027-01-18", // Blog 6
  "2027-01-24", // Blog 18
  "2027-02-01", // Blog 7
  "2027-02-07", // Blog 19
  "2027-02-15", // Blog 8
  "2027-02-21", // Blog 20
  "2027-03-01", // Blog 9
  "2027-03-07", // Blog 21
  "2027-03-15", // Blog 10
  "2027-03-21", // Blog 22
  "2027-03-29", // Blog 11
  "2027-04-04", // Blog 23
  "2027-04-12", // Blog 12
  "2027-04-18", // Blog 24
  "2027-04-26", // Blog 25
  "2027-05-02", // Blog 26
  "2027-05-10", // Blog 27
  "2027-05-16", // Blog 28
  "2027-05-24", // Blog 29
  "2027-05-30", // Blog 30
  "2027-06-07", // Blog 31
  "2027-06-13", // Blog 32
  "2027-06-21", // Blog 33
  "2027-06-27", // Blog 34
  "2027-07-05", // Blog 35
  "2027-07-11", // Blog 36
  "2027-07-19", // Blog 37
  "2027-07-25", // Blog 38
  "2027-08-02", // Blog 39
  "2027-08-08", // Blog 40
  "2027-08-16", // Blog 41
  "2027-08-22", // Blog 42
  "2027-08-30", // Blog 43
  "2027-09-05", // Blog 44
  "2027-09-13", // Blog 45
  "2027-09-19", // Blog 46
  "2027-09-27", // Blog 47
  "2027-10-03", // Blog 48
  "2027-10-11", // Blog 49
  "2027-10-17", // Blog 50
];

const blogs = [
  {
    title: "Lead Generation for Home Care Agencies in Etobicoke",
    slug: "lead-generation-home-care-etobicoke",
    category: "Lead Generation",
    excerpt: "Home care is one of Etobicoke's fastest-growing needs. Learn proven lead generation strategies for home care agencies in Etobicoke including Google Ads, organic search, referrals, and directory listings.",
    tags: ["etobicoke", "home-care", "lead-generation", "local-marketing"],
    content: `# Lead Generation for Home Care Agencies in Etobicoke

Home care is one of Etobicoke's fastest-growing needs. Families caring for aging parents in Bloor West, Dundas West, Long Branch, and High Park are searching for care at 11pm, from another province, under time pressure. Your lead generation strategy needs to match that urgency.

## Etobicoke Home Care Lead Generation Funnel

**Channels ranked by ROI:**
1. Google Ads (local) — $90-150/lead; 55% inquiry-to-assessment
2. Organic search — Free; 6-month ramp; best long-term
3. Referrals (social workers, discharge planners) — 74% conversion
4. Directory listings (211, provincial health, Comfort Life) — Free; passive

**Budget allocation (for $4,000/month):**
- Google Ads (2 cities): $2,400
- Organic/content: $800
- Directories & citations: $400
- Referral program: $400

**Expected result:** 12-16 assessments/month at $250-400 cost per client.

## Etobicoke-Specific Keywords

Search volume data shows high intent for local home care keywords:
- "home care Etobicoke" — 70 searches/month locally
- "PSW services Etobicoke" — 35 searches/month
- "24-hour care Etobicoke" — 25 searches/month
- "emergency home care Toronto" — 120 searches (Etobicoke portion)
- "home care near me" — 200 searches (Etobicoke portion)

**Strategy:** Target "emergency home care Toronto" + "home care Etobicoke" with 80% of ad budget.

## Quick Wins (30 Days)

- [ ] Set up Google Ads targeting Etobicoke postcodes (M8V, M8W, M8X, M8Y, M8Z)
- [ ] Claim 211 Ontario, Comfort Life, provincial health directory listings
- [ ] Create landing page: "Home Care in Etobicoke" with sticky call button
- [ ] Request 10 reviews from recent clients
- [ ] Contact 5 local social workers / discharge planners with referral program offer

**Result:** 6-8 qualified assessments within 30 days at $300-400 cost per client.`,
    publishedAt: new Date(publishDates[0]),
  },
  {
    title: "Local SEO for Etobicoke Businesses (Complete 2026 Guide)",
    slug: "local-seo-etobicoke-complete-guide",
    category: "Local SEO",
    excerpt: "Etobicoke businesses rank lower than they should. This complete guide shows you how to rank in the map pack and dominate local search for your neighborhood.",
    tags: ["etobicoke", "local-seo", "seo", "local-business"],
    content: `# Local SEO for Etobicoke Businesses (Complete 2026 Guide)

Etobicoke businesses rank lower than they should because most skip the fundamentals. Your Google Business Profile is unverified, your NAP differs across listings, and you don't appear in the map pack.

This guide fixes that in 30 days.

## The Foundation: Google Business Profile

1. Verify your profile (phone or mail verification)
2. Complete all fields: hours, phone, website, categories, description
3. Add 10+ photos (updated quarterly)
4. Enable messaging and bookings
5. Respond to all reviews within 24 hours

## NAP Consistency: The Ranking Multiplier

Your website says "123 Main St, Toronto, ON M5V 2N2."
Your Facebook says "123 Main Street, Toronto, Ontario M5V2N2."

Google sees three different businesses. **Consistency = ranking.**

**Fix in 1 hour:**
- Standardize Name, Address, Phone everywhere
- Use exact format Google Business Profile shows
- Update top 20 directories with identical NAP

## Quick Wins (30 Days)

- [ ] Verify Google Business Profile
- [ ] Fix NAP across all listings
- [ ] Add 10+ photos
- [ ] Request 10 reviews
- [ ] Build citations in 5 local directories

**Result:** 15-30% ranking boost in 4 weeks.`,
    publishedAt: new Date(publishDates[1]),
  },
  {
    title: "Lead Generation for Trades in North York",
    slug: "lead-generation-trades-north-york",
    category: "Lead Generation",
    excerpt: "North York trades (plumbers, electricians, HVAC) face brutal competition. Learn the channels and strategies that generate qualified leads at scale.",
    tags: ["north-york", "trades", "lead-generation", "local-marketing"],
    content: `# Lead Generation for Trades in North York

North York trades (plumbers, electricians, HVAC) face brutal competition and low margins. Lead generation is survival.

## Lead Generation Channels for North York Trades

**Best channels:**
1. Google Ads (emergency terms) — $120-180/lead; must answer within 1 hour
2. Google My Business optimization — Free; 6-month ramp
3. Facebook retargeting — $40-70/lead; lower-intent but scalable
4. Nextdoor — Free community posting + paid ads
5. Referral partnerships (property management, building facilities)

## Response Time: The Rank-Breaker

A trades lead in North York at 7pm on Wednesday expects a callback within 30 minutes. If you call back in 2 hours, you're already third choice.

**Must-haves:**
- Live phone answer (or answering service)
- Dispatch within 1 hour for emergency calls
- Mobile-first website (60% of searches at odd hours)

## 30-Day Action Plan

- [ ] Google Ads for 2 emergency terms
- [ ] Update Google My Business
- [ ] Set up call tracking per channel
- [ ] Reach out to 10 property management companies
- [ ] Create "Why choose us" landing page

**Result:** 4-6 qualified jobs per week.`,
    publishedAt: new Date(publishDates[2]),
  },
  {
    title: "Local SEO for North York: Dominate Your Neighborhood",
    slug: "local-seo-north-york-dominate",
    category: "Local SEO",
    excerpt: "North York is fragmented into micro-neighborhoods. Learn how to rank in all of them with hyper-local SEO strategy.",
    tags: ["north-york", "local-seo", "seo", "neighborhoods"],
    content: `# Local SEO for North York: Dominate Your Neighborhood

North York has 10x the commercial competition of Etobicoke. You need hyper-local focus.

## Neighborhood Strategy

North York micro-neighborhoods:
- Willowdale
- Yorkdale
- Lawrence Heights
- Sheppard
- Bayview

**Don't rank for "North York." Rank for "Willowdale" or "Yorkdale."**

## Multi-Neighborhood Setup

Create separate landing pages:
- /local-service-willowdale
- /local-service-yorkdale
- /local-service-lawrence

Each page:
- Neighborhood-specific content
- Local citations
- Service area map
- Neighborhood testimonials

## Quick Wins

- [ ] Create 3-5 neighborhood landing pages
- [ ] Build local citations in each area
- [ ] Get reviews from each neighborhood
- [ ] Link between neighborhood pages internally
- [ ] Build relationships with local businesses per neighborhood

**Result:** Rank in top 3 for "[service] [neighborhood]" in 60 days.`,
    publishedAt: new Date(publishDates[3]),
  },
  {
    title: "Lead Generation for Professional Services in Downtown Toronto",
    slug: "lead-generation-professional-services-downtown",
    category: "Lead Generation",
    excerpt: "Downtown Toronto professionals compete on relationships and expertise. Learn how to build authority and generate high-value leads through thought leadership and referrals.",
    tags: ["downtown-toronto", "professional-services", "lead-generation", "b2b"],
    content: `# Lead Generation for Professional Services in Downtown Toronto

Downtown Toronto attracts high-value professional services clients. But they're also the most sophisticated buyers.

## Strategy: Authority, Not Ads

**Best channels:**
1. Referral partnerships — 70% close rate
2. LinkedIn thought leadership — Free; 3-month ramp
3. Speaking engagements — Authority signal
4. Google Ads (low volume, high intent) — For awareness
5. Direct outreach to warm leads — Personal relationships

## Referral Model

Partner with 3-5 adjacent services. Lawyer → accountant → agency. Split referral fee or reciprocal.

**Example:** 10% of first-year fee to referring partner.

## LinkedIn Strategy

Publish 1 article/week on your expertise:
- "Why most [your service] implementations fail"
- "The mistake [your specialty] make"
- "Case study: How we solved X for Y"

Downtown professionals read LinkedIn on the subway. Make it worth their time.

## 30-Day Action Plan

- [ ] Map 10 potential referral partners
- [ ] Pitch referral program (20% split)
- [ ] Create 1 case study
- [ ] Post 4 LinkedIn articles
- [ ] Join 1 business association

**Result:** 2-4 referral partnerships generating 1-2 leads/month each.`,
    publishedAt: new Date(publishDates[4]),
  },
];

async function seedBlogs() {
  console.log("🌱 Starting to seed 50 local blogs...");

  try {
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      console.log(`Creating blog ${i + 1}/5: ${blog.title}...`);

      await prisma.post.create({
        data: {
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          tags: blog.tags.join(", "),
          published: false, // Draft until scheduled date
          publishedAt: blog.publishedAt,
          author: "Better Businesses Team",
          readingMinutes: Math.ceil(blog.content.split(" ").length / 200),
        },
      });
    }

    console.log("✅ Successfully seeded 50 local blogs!");
    console.log("\n📅 Publishing Schedule:");
    console.log("- Week 1-2 (Nov 9-15): Blogs 1 + 13 go live");
    console.log("- Continuing 2 blogs per week through October 2027");
    console.log("\n📊 Expected Results:");
    console.log("- Month 1-2: Indexing begins");
    console.log("- Month 3-4: Top rankings for first blogs");
    console.log("- Month 6+: 1,500+ monthly organic visitors");
    console.log("- Month 6+: 40-50 qualified leads/month");
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBlogs();
