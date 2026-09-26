/** Load and re-serialize the starter-article part files with a stable field order (used by the citation tooling). */
import { writeFileSync } from "node:fs";
import type { SeedPost } from "../../src/lib/seed-posts/types";

export const PARTS = ["part1", "part2", "part3", "part4", "part5", "part6"] as const;
const esc = (s: string) => JSON.stringify(s);

export async function loadPart(name: string): Promise<SeedPost[]> {
  const mod = await import(`../../src/lib/seed-posts/${name}.ts`);
  return mod[name] as SeedPost[];
}

export function writePart(name: string, posts: SeedPost[]) {
  const lines = posts.map((p) => {
    const f: string[] = [];
    f.push(`    slug: ${esc(p.slug)},`, `    title: ${esc(p.title)},`, `    excerpt: ${esc(p.excerpt)},`, `    category: ${esc(p.category)},`, `    tags: ${esc(p.tags)},`, `    readingMinutes: ${p.readingMinutes},`, `    publishedAt: ${esc(p.publishedAt)},`);
    if (p.featured !== undefined) f.push(`    featured: ${p.featured},`);
    if (p.seoTitle !== undefined) f.push(`    seoTitle: ${esc(p.seoTitle)},`);
    f.push(`    seoDescription: ${esc(p.seoDescription)},`);
    if (p.faqs) f.push(`    faqs: [\n${p.faqs.map((q) => `      { question: ${esc(q.question)}, answer: ${esc(q.answer)} },`).join("\n")}\n    ],`);
    f.push(`    content: ${esc(p.content)},`);
    return `  {\n${f.join("\n")}\n  },`;
  });
  writeFileSync(`src/lib/seed-posts/${name}.ts`, `import type { SeedPost } from "./types";\n\nexport const ${name}: SeedPost[] = [\n${lines.join("\n")}\n];\n`);
}
