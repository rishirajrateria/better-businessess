# Better Businesses — betterbusinesses.ca

**Strategy. Growth. Results.**

A production-grade marketing website + admin backend for Better Businesses, a Canadian digital growth agency
(lead generation, SEO, website development, branding). Built to rank in Google **and** to be understood and
recommended by AI assistants (ChatGPT, Claude, Gemini, Perplexity).

## What's inside

| Area | Details |
| --- | --- |
| **Framework** | Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS v4 |
| **Design** | Minimal, Apple-inspired "liquid glass" UI using the brand's black / gold / off-white palette. Fonts: **Sora** (display) + **Manrope** (body), self-hosted via Fontsource. No Apple fonts. |
| **Public pages** | Home · Services hub · 4 core service pages · 6 specialty pages · Service × Canada (4) · Service × Province (52) · Service × City (264) · Province hubs (13) · City hubs (66) · Blog · Projects · About · Contact · FAQ · Privacy · Terms · 404 |
| **Programmatic SEO** | `src/lib/content.ts` generates unique copy, FAQs, industry angles and internal links per service/location combination. Pages are statically generated (437 at build time). |
| **AI / LLM optimization** | `/llms.txt` and `/llms-full.txt`, AI-crawler-friendly `robots.txt`, JSON-LD on every page (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList, Article, WebPage with `speakable`), "At a glance" fact blocks, entity-consistent NAP, semantic HTML. |
| **Admin backend** (`/admin`) | Analytics dashboard (first-party, privacy-friendly), leads inbox with status pipeline + notes + CSV export, blog CMS (Markdown editor with preview, FAQs, SEO fields), projects/case studies CMS, testimonials, client logos, custom FAQs, password management. |
| **Lead capture** | Contact forms on every service/location page and the contact page → `/api/contact` → database + optional email alert via Resend. Source page, referrer and UTM parameters are captured for attribution. |
| **Analytics** | `/api/track` records page views (path, referrer, device, browser, country via Vercel headers, UTM); `/api/track/event` records CTA clicks, phone clicks, form starts/submits. Optional GA4 via `NEXT_PUBLIC_GA_ID`. |
| **Database** | Prisma ORM. SQLite for local development, Postgres for production (one-line switch). |

## Quick start

```bash
cp .env.example .env         # then edit values (see below)
npm install
npm run db:push              # create the local SQLite database
npm run db:seed              # create admin user + starter content
npm run dev                  # http://localhost:3000
```

Admin: `http://localhost:3000/admin` — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.
**Change the password immediately** in Admin → Account.

## Configure the brand (do this first)

1. **`src/lib/site.ts`** — business name, email, phone, headquarters address, hours, social links, stats.
   Keep the NAP (name, address, phone) *identical* to your Google Business Profile and directories; this is the
   single most important entity signal for both Google and AI models.
2. **`.env`** — `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET` (long random string), `RESEND_API_KEY` for lead alerts,
   `NEXT_PUBLIC_GA_ID` (optional), `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (optional).
3. **`public/brand/logo.png`** — your logo (already included). `public/icon.svg` and `public/apple-icon.png` are the favicons.
4. Optional copy tweaks: `src/lib/services.ts` (service copy, deliverables, FAQs, pricing guidance) and
   `src/lib/locations.ts` (provinces/cities; add or remove cities freely — pages regenerate automatically).

## Deploying (Vercel + Postgres recommended)

1. Create a Postgres database (Neon, Supabase, Vercel Postgres, Railway…).
2. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`.
3. Set `DATABASE_URL` to the Postgres connection string (plus all other env vars) in Vercel → Settings → Environment Variables.
4. Deploy. Then run once from your machine (with production `DATABASE_URL` in `.env`):
   ```bash
   npx prisma db push && npm run db:seed
   ```
5. Point `betterbusinesses.ca` at Vercel. Submit `https://betterbusinesses.ca/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Any Node host works as well (`npm run build && npm start`). The build command already runs `prisma generate`.

## Content workflow

- **Blog**: Admin → Blog posts → New. Markdown body, excerpt, category, tags, cover image URL, FAQs (rendered with
  FAQ schema), SEO title/description. Publishing revalidates the site instantly.
- **Projects**: Admin → Projects. Client, industry, location, services, summary, challenge/solution (Markdown),
  results (`Label: Value` per line), gallery, testimonial. "Featured" shows on the homepage.
- **Testimonials / Client logos / FAQs**: simple inline forms. Testimonials can be tied to a service so they appear on that service's pages.
- **Images**: paste hosted image URLs (Cloudinary, Vercel Blob, your CDN, or files you add to `public/`).

## URL structure

```
/services/seo                                  service
/services/seo/canada                           service + country
/services/seo/ontario                          service + province
/services/seo/ontario/toronto                  service + city
/locations/ontario                             province hub
/locations/ontario/toronto                     city hub (all services)
/blog/<slug>   /projects/<slug>   /about   /contact   /faq
/llms.txt   /llms-full.txt   /sitemap.xml   /robots.txt
```

## Subdomains per service (seo.betterbusinesses.ca, ads.betterbusinesses.ca)?

**Not recommended.** Google treats subdomains largely as separate sites, so each one would have to earn its own
authority and backlinks, and the internal links between them pass less value. One strong domain with well-structured
subfolders (`/services/seo`, `/services/lead-generation`) concentrates all authority, which is why this site is built
that way. Subdomains only make sense for genuinely separate products or regions with separate teams. If you ever want
branded short URLs for ads, use redirects (e.g. `seo.betterbusinesses.ca → /services/seo`) rather than separate sites.

## SEO & AI-visibility checklist after launch

- [ ] Verify domain in Google Search Console + Bing Webmaster Tools; submit the sitemap.
- [ ] Create/claim Google Business Profile with the exact same NAP as `site.ts`; add services and photos; collect reviews.
- [ ] Fill in social profile URLs in `site.ts` (they feed the Organization `sameAs` schema).
- [ ] Publish 2+ blog posts per month; add at least 3 projects and 6 testimonials (seeded examples can be replaced).
- [ ] Get listed in Canadian directories and industry associations (consistent NAP).
- [ ] Periodically ask ChatGPT / Gemini / Perplexity "best SEO agency in <city>" and track when you are cited.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript check |
| `npm run db:push` | Sync schema to the database (dev) |
| `npm run db:migrate` / `db:deploy` | Migrations (recommended for production changes) |
| `npm run db:seed` | Seed admin user + starter content (idempotent) |
| `npm run db:studio` | Prisma Studio GUI |

## Project layout

```
prisma/               schema + seed
src/app/(site)/       public pages (route group with header/footer)
src/app/admin/        admin console: (auth)/login and (dashboard)/…
src/app/api/          contact + tracking endpoints
src/app/llms.txt      LLM-friendly summaries; sitemap.ts, robots.ts, opengraph-image.tsx
src/components/site   marketing UI (Hero, ServicePage template, Sections, ContactForm, Analytics…)
src/components/admin  admin UI (forms, charts, sidebar, markdown editor)
src/lib/site.ts       brand / NAP config      src/lib/services.ts   service catalogue
src/lib/locations.ts  provinces & cities      src/lib/content.ts    programmatic copy engine
src/lib/seo.ts        metadata + JSON-LD      src/lib/admin-actions.ts server actions
```
