/**
 * Writes research inputs for the sourcing pipeline (ignored by git):
 *   .research/cities.json      — city metadata from src/lib/locations.ts
 *   .research/posts/<slug>.md  — every starter article as Markdown
 * usage: npx tsx scripts/research-export.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { seedPosts } from "../src/lib/seed-posts/index";
import { cities, provinces } from "../src/lib/locations";

mkdirSync(".research/posts", { recursive: true });
for (const p of seedPosts) writeFileSync(`.research/posts/${p.slug}.md`, `# ${p.title}\n\n${p.content}`);
writeFileSync(
  ".research/cities.json",
  JSON.stringify(
    cities.map((c) => {
      const p = provinces.find((x) => x.slug === c.province)!;
      return { slug: c.slug, name: c.name, province: p.name, provinceCode: p.code, industries: c.industries, areas: c.areas, fact: c.fact };
    }),
    null,
    1,
  ),
);
console.log(`wrote ${seedPosts.length} articles and ${cities.length} cities to .research/`);
