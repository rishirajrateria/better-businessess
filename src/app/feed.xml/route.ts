import { prisma } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** RSS 2.0 feed of the blog — feed readers, Bing and AI content pipelines discover new articles here. */
export async function GET() {
  let posts: { slug: string; title: string; excerpt: string; content: string; category: string | null; author: string; publishedAt: Date | null; updatedAt: Date; createdAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 50, select: { slug: true, title: true, excerpt: true, content: true, category: true, author: true, publishedAt: true, updatedAt: true, createdAt: true } });
  } catch {}
  const lastBuild = posts[0]?.updatedAt ?? new Date(site.staticContentUpdated);
  const items = posts
    .map((p) => {
      const url = `${site.url}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
      <dc:creator>${esc(site.author.name || p.author)}</dc:creator>
      ${p.category ? `<category>${esc(p.category)}</category>` : ""}
      <description>${esc(p.excerpt)}</description>
      <content:encoded>${cdata(renderMarkdown(p.content))}</content:encoded>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)} Blog</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc("Guides on lead generation, SEO, AI search, website performance and branding for Canadian businesses.")}</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <image>
      <url>${site.url}/brand/logo.png</url>
      <title>${esc(site.name)}</title>
      <link>${site.url}</link>
    </image>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600, stale-while-revalidate=86400" } });
}
