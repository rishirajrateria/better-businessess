/**
 * Applies verified citations to the starter articles.
 * usage: npx tsx scripts/apply-citations.mts <checkedOn YYYY-MM-DD> <task-output.json> [more ...]
 * For each article: links the cited sentence inline (once) and appends a "## Sources" list.
 * Rewrites src/lib/seed-posts/part*.ts in place (same field order, JSON-escaped strings).
 */
import { readFileSync, writeFileSync } from "node:fs";
import type { SeedPost } from "../src/lib/seed-posts/types";

const [checkedOn, ...files] = process.argv.slice(2);
type Article = { slug: string; sources: { quote: string; url: string; publisher: string; title: string }[]; flags: { quote: string; issue: string; evidenceUrl: string }[] };
const articles: Article[] = [];
for (const src of files) {
  const raw = JSON.parse(readFileSync(src, "utf8"));
  const list: Article[] = raw.result?.articles ?? raw.articles ?? [];
  console.log(src.split("/").pop(), "->", list.length, "articles");
  articles.push(...list);
}
if (!articles.length) throw new Error("no articles in output");

const parts = ["part1", "part2", "part3", "part4", "part5", "part6"];
const esc = (s: string) => JSON.stringify(s);
const isUrl = (u: string) => /^https?:\/\/[^\s"'<>()]+$/.test(u);
const cleanTitle = (s: string) => s.replace(/\s+/g, " ").replace(/[\[\]]/g, "").replace(/\s*[|–—-]\s*(Statistics Canada|Canada\.ca|Government of Canada)\s*$/i, "").trim().slice(0, 110);
const MONTH = new Date(checkedOn).toLocaleDateString("en-CA", { month: "long", year: "numeric" });

function applyTo(post: SeedPost, a: (typeof articles)[number]) {
  let content = post.content;
  if (/^##\s+Sources\s*$/m.test(content)) return { content, inline: 0, listed: 0 }; // already done
  const seen = new Set<string>();
  const kept: typeof a.sources = [];
  for (const s of a.sources) {
    if (!isUrl(s.url) || seen.has(s.url) || !s.quote || s.quote.length < 20) continue;
    seen.add(s.url);
    kept.push(s);
    if (kept.length >= 7) break;
  }
  let inline = 0;
  for (const s of kept) {
    const idx = content.indexOf(s.quote);
    if (idx < 0 || content.indexOf(s.quote, idx + 1) >= 0) continue; // must be verbatim and unique
    const lineStart = content.lastIndexOf("\n", idx) + 1;
    const lineEnd = content.indexOf("\n", idx) === -1 ? content.length : content.indexOf("\n", idx);
    const line = content.slice(lineStart, lineEnd);
    if (/^\s*(#|\||>)/.test(line) || /\]\(/.test(line.slice(idx - lineStart, idx - lineStart + s.quote.length))) continue; // skip headings, tables, quotes, existing links
    // end of the sentence containing the quote (within the same paragraph line)
    const after = content.slice(idx + s.quote.length, lineEnd);
    const m = /[.!?]["”)]?(\s|$)/.exec(after);
    const insertAt = m ? idx + s.quote.length + m.index + m[0].length - m[1].length : lineEnd;
    const label = s.publisher.replace(/[()\[\]]/g, "").trim() || "Source";
    content = `${content.slice(0, insertAt)} ([${label}](${s.url}))${content.slice(insertAt)}`;
    inline++;
  }
  if (kept.length) {
    const list = kept.map((s, i) => `${i + 1}. [${cleanTitle(s.title) || s.publisher}](${s.url}) — ${s.publisher.trim()}`).join("\n");
    content = `${content.trimEnd()}\n\n## Sources\n\n${list}\n\n*Sources checked ${MONTH}.*\n`;
  }
  return { content, inline, listed: kept.length };
}

function serialize(name: string, posts: SeedPost[]) {
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
  return `import type { SeedPost } from "./types";\n\nexport const ${name}: SeedPost[] = [\n${lines.join("\n")}\n];\n`;
}

let totalInline = 0, totalListed = 0, touched = 0;
const flags: string[] = [];
for (const name of parts) {
  const mod = await import(`../src/lib/seed-posts/${name}.ts`);
  const posts: SeedPost[] = mod[name];
  let changed = false;
  for (const p of posts) {
    const a = articles.find((x) => x.slug === p.slug);
    if (!a) continue;
    for (const fl of a.flags || []) flags.push(`${p.slug}: "${fl.quote.slice(0, 90)}" — ${fl.issue} (${fl.evidenceUrl})`);
    const r = applyTo(p, a);
    if (r.content !== p.content) { p.content = r.content; changed = true; touched++; totalInline += r.inline; totalListed += r.listed; }
  }
  if (changed) writeFileSync(`src/lib/seed-posts/${name}.ts`, serialize(name, posts));
}
console.log(`articles updated: ${touched}, inline citations: ${totalInline}, listed sources: ${totalListed}`);
if (flags.length) { console.log(`\nACCURACY FLAGS (${flags.length}) — review manually:`); for (const f of flags) console.log(" -", f); }
