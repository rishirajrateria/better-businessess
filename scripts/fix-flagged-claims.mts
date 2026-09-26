/**
 * One-off corrections for statements the citation fact-check flagged as wrong or outdated
 * (research/out/articles/*.json → flags). Each edit is a verbatim find → replace inside one article.
 * usage: npx tsx scripts/fix-flagged-claims.mts
 */
import { PARTS, loadPart, writePart } from "./lib/seed-posts-io.mts";

const EDITS: [slug: string, find: string, replace: string][] = [
  ["ai-search-optimization-guide-canadian-businesses", "The sources Google documents are ChatGPT, Gemini, DeepSeek, Copilot and Grok. Claude and Perplexity are not on that list and still land in generic Referral, so you need a custom channel group covering chatgpt.com, perplexity.ai, gemini.google.com, claude.ai and copilot.microsoft.com.", "Google's documented examples include ChatGPT, Gemini, Microsoft Copilot, Claude and Perplexity, so those referrals are grouped automatically; a custom channel group is still worth building to split the channel by assistant and to catch any newcomer Google has not yet added."],
  ["cannabis-retail-marketing-canada", "Ontario caps any single operator at 75 store authorizations", "Ontario caps any single operator, together with its affiliates, at 150 store authorizations (up from the earlier limit of 75)"],
  ["casl-compliance-guide-lead-generation-email-canada", "(form, page, timestamp, IP, the wording shown) for at least three years after the relationship ends.", "(form, page, timestamp, IP, the wording shown) for as long as you continue to contact that person. CASL sets no fixed retention period; the CRTC's guidance is that you must be able to demonstrate consent for every message you send."],
  ["cleaning-company-marketing-canada", "worker classification under CRA guide RC4110", "worker classification under the CRA's Employment status: Employee or self-employed guidance (which replaced guide RC4110 in January 2026)"],
  ["digital-marketing-for-contractors-home-services-canada", "appear above everything else with a \"Google Guaranteed\" badge", "appear above everything else with a \"Google Verified\" badge (it replaced the Google Guaranteed, Google Screened and License Verified badges in October 2025)"],
  ["home-care-agency-marketing-canada", "Ontario has licensed temporary help agencies under the Employment Standards Act since January 2024", "Ontario has licensed temporary help agencies under the Employment Standards Act since July 1, 2024"],
  ["how-much-does-a-website-cost-in-canada", "That deadline was 1 January 2025 and has passed.", "That deadline was 1 January 2021 and has long passed."],
  ["how-to-get-more-google-reviews-canada", "- Add Review or AggregateRating schema so Google can show star ratings in search results.", "- Do not add Review or AggregateRating schema to your own pages expecting stars: Google no longer shows review snippets for self-serving reviews on LocalBusiness or Organization pages. Star ratings in search come from your Google Business Profile, not your markup."],
  ["landscaping-snow-removal-marketing-canada", "Google Local Services Ads run in Canada for lawn care, landscaping and snow removal.", "Google Local Services Ads run in Canada for lawn care; landscaping and snow removal are not listed as separate Canadian categories, so check Google's current category list before planning around them."],
  ["landscaping-snow-removal-marketing-canada", "According to ISED's Canadian Industry Statistics, roughly 40,000 to 45,000 landscaping services locations operate in Canada under NAICS 56173, most of them small employers.", "ISED's Canadian Industry Statistics publishes business counts only for the wider services-to-buildings-and-dwellings group (NAICS 5617): 48,115 non-employer and 28,724 employer establishments, of which landscaping (NAICS 56173) is a large share, most of them small."],
  ["manufacturer-industrial-b2b-marketing-canada", "and a net-zero style claim to rest on an internationally recognized methodology, with substantiation the advertiser's burden.", "with substantiation the advertiser's burden; the separate requirement that business-level environmental claims follow an internationally recognized methodology was repealed in March 2026, but every claim must still rest on adequate and proper testing."],
  ["restaurant-marketing-canada", "15 percent for core delivery service plus a maximum of 5 percent in other fees.", "20 percent for core delivery service plus a maximum of 5 percent in other fees (15 percent was the temporary pandemic-era cap)."],
  ["restaurant-marketing-canada", "about $2.00 per standard drink before HST", "about $2.00 per standard drink including taxes"],
  ["roofing-company-marketing-canada", "WSIB coverage is compulsory for roofing contractors, including sole proprietors, and homeowners", "WSIB coverage is compulsory for roofing contractors with workers and for independent operators, except those doing only homeowner-hired renovation work on existing homes, and homeowners"],
  ["salon-barbershop-marketing-canada", "TikTok was ordered by the federal government in late 2024 to wind down its Canadian corporate operations, yet its ad platform remains open to Canadian advertisers.", "TikTok was ordered by the federal government in late 2024 to wind down its Canadian corporate operations, an order lifted in March 2026 after a further national security review, and its ad platform has stayed open to Canadian advertisers throughout."],
  ["therapist-counsellor-marketing-canada", "and roughly half reported unmet needs.", "and more than one in three (36.6 percent) reported unmet or partially met care needs."],
  ["wedding-event-vendor-marketing-canada", "roughly $9.25 to $39.33 per event without dancing and $18.51 to $78.66 with dancing, by room capacity.", "the Re:Sound fee alone runs roughly $9.25 to $39.33 per event without dancing and $18.51 to $78.66 with dancing by room capacity, and SOCAN Tariff 8 adds a separate $22.06 to $93.78 without dancing or $44.13 to $187.55 with dancing."],
  ["why-your-landing-page-isnt-converting", "\"Google Guaranteed\" or association badges", "\"Google Verified\" or association badges"],
];

let applied = 0;
const pending = new Set(EDITS.map((e) => e.join("\u0000")));
for (const name of PARTS) {
  const posts = await loadPart(name);
  let changed = false;
  for (const p of posts) {
    for (const e of EDITS) {
      const [slug, find, replace] = e;
      if (p.slug !== slug) continue;
      const n = p.content.split(find).length - 1;
      if (n !== 1) { console.log(`SKIP ${slug}: expected 1 match, found ${n} for "${find.slice(0, 60)}"`); continue; }
      p.content = p.content.replace(find, replace);
      pending.delete(e.join("\u0000"));
      applied++;
      changed = true;
    }
  }
  if (changed) writePart(name, posts);
}
console.log(`applied ${applied}/${EDITS.length} corrections`);
if (pending.size) process.exitCode = 1;
