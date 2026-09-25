import { prisma } from "./db";
import type { City, Province } from "./locations";
import type { Service } from "./services";

/**
 * Cross-links the programmatic service/location pages with the blog's industry and service guides.
 * The guides hold the site's deepest, most citable content, so every service, city and province
 * page surfaces the three most relevant ones — giving each article dozens of inbound links and
 * giving each location page a set of links that differs with its local economy.
 */
export type Guide = { slug: string; title: string; excerpt: string; category: string | null; coverImage: string | null; coverAlt: string | null; publishedAt: Date | null; readingMinutes: number };

const byService: Record<string, RegExp> = {
  "lead-generation": /lead|google-ads|landing-page|casl|contractors|convert/,
  "google-ads": /google-ads|landing-page|lead/,
  "social-media-advertising": /lead|landing-page|casl/,
  seo: /seo|ai-search|google-reviews|redesign/,
  "local-seo": /local-seo|google-reviews|seo/,
  "website-development": /website|redesign|bill-96|landing-page/,
  "ecommerce-development": /ecommerce|website|redesign/,
  branding: /rebrand|brand|logo|choose-a-digital-marketing-agency/,
  "logo-design": /rebrand|brand|logo/,
  "graphic-design": /rebrand|brand/,
};

/** City/province industry labels (locations.ts) → industry guide slugs. Buckets are deliberately broad so every guide is reachable. */
const byIndustry: [RegExp, RegExp][] = [
  [/health|pharma|life sciences|bioscience|wellness/i, /dental|physio|therap|massage|optom|veterin|medical-spa|home-care|gym|funeral|salon/],
  [/construction|housing|real estate|forestry/i, /plumb|hvac|electric|roof|renovat|paint|landscap|pool|solar|tree|contractor|moving|cleaning|pest|property-management|real-estate/],
  [/retail|consumer|tourism|hospitality|wine|culture|film|arts/i, /retail|ecommerce|cannabis|salon|pet-groom|restaurant|hotel|brewer|wedding|pool|gym/],
  [/education|university|college|government|public|customer service|professional|legal/i, /tutoring|daycare|coach|nonprofit|immigration|staffing|law-firm|accounting|therap|funeral/],
  [/technology|software|ai|artificial|cyber|ocean tech|aerospace|defence|aviation/i, /saas|it-services|msp|manufactur|staffing/],
  [/manufactur|food processing|agri-food|automotive|logistics|transport|marine|trucking|port/i, /manufactur|trucking|car-dealership|auto-repair|moving|staffing/],
  [/financ|insurance|banking/i, /financial-advisor|accounting|mortgage|insurance|property-management/],
  [/agricultur|farm|fisher|energy|mining|oil|gas|resource|offshore/i, /solar|trucking|manufactur|electric|hvac|staffing|landscap|brewer/],
];

let cache: { at: number; posts: Promise<Guide[]> } | null = null;
function allGuides(): Promise<Guide[]> {
  if (cache && Date.now() - cache.at < 60_000) return cache.posts;
  const posts = prisma.post
    .findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, select: { slug: true, title: true, excerpt: true, category: true, coverImage: true, coverAlt: true, publishedAt: true, readingMinutes: true } })
    .catch(() => [] as Guide[]);
  cache = { at: Date.now(), posts };
  return posts;
}

/** Small deterministic hash so equally relevant guides rotate between pages instead of the same three winning everywhere. */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
};

export async function getRelatedGuides(opts: { service?: Service; city?: City; province?: Province; limit?: number }): Promise<Guide[]> {
  const posts = await allGuides();
  if (!posts.length) return [];
  const limit = opts.limit ?? 3;
  const svc = opts.service ? byService[opts.service.slug] : undefined;
  const industries = (opts.city?.industries ?? opts.province?.industries ?? []).slice(0, 4);
  const seed = `${opts.service?.slug ?? ""}:${opts.city?.slug ?? opts.province?.slug ?? "canada"}`;
  const scored = posts.map((p, i) => {
    const key = `${p.slug} ${p.category ?? ""}`.toLowerCase();
    let score = 0;
    if (svc?.test(key)) score += 3;
    // Any of the location's leading sectors counts equally; the per-page jitter then rotates which
    // matching guides appear, so links spread across all industry articles instead of a favoured few.
    if (industries.some((label) => byIndustry.some(([l, g]) => l.test(label) && g.test(key)))) score += 2;
    if (score > 0) score += hash(`${seed}:${p.slug}`);
    // Industry guides only earn a place through an industry match; general guides through the service.
    return { p, score, i };
  });
  const isIndustry = (p: Guide) => (p.category ?? "").toLowerCase().includes("industry");
  const ranked = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.p);
  const serviceGuides = ranked.filter((p) => !isIndustry(p));
  const industryGuides = ranked.filter(isIndustry);
  // Interleave so a location page always carries at least one industry guide chosen for its
  // local economy (that is what spreads links across all ~50 industry articles) alongside the
  // service playbooks; pages without an industry match just take the best service guides.
  const out: Guide[] = [];
  const order = industryGuides.length && serviceGuides.length ? [serviceGuides, industryGuides, serviceGuides, industryGuides] : [serviceGuides, industryGuides];
  const cursors = new Map<Guide[], number>();
  while (out.length < limit) {
    let progressed = false;
    for (const list of order) {
      if (out.length >= limit) break;
      const idx = cursors.get(list) ?? 0;
      if (idx < list.length) {
        out.push(list[idx]);
        cursors.set(list, idx + 1);
        progressed = true;
      }
    }
    if (!progressed) break;
  }
  for (const p of posts) {
    if (out.length >= limit) break;
    if (!out.includes(p)) out.push(p);
  }
  return out;
}
