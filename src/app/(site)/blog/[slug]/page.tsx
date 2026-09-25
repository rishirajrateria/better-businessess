import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/Cards";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectTile } from "@/components/site/Visuals";
import { InlineCta } from "@/components/site/Sections";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { getPostBySlug, getPublishedPosts, parseJson, splitList } from "@/lib/queries";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { articleSchema, breadcrumbSchema, buildMetadata, faqSchema, graph } from "@/lib/seo";
import { TITLE_MAX } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/db";
import type { Faq } from "@/lib/services";
import { site } from "@/lib/site";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  // Long headlines keep every keyword instead of being cut for the " | Brand" suffix (the site name still shows in results via WebSite schema).
  return buildMetadata({ title, absoluteTitle: title.length > TITLE_MAX, description: post.seoDescription || post.excerpt, path: `/blog/${post.slug}`, type: "article", image: post.coverImage ?? undefined, publishedTime: post.publishedAt?.toISOString(), modifiedTime: post.updatedAt.toISOString(), keywords: splitList(post.tags) });
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);
  const headings = extractHeadings(post.content).filter((h) => h.depth === 2);
  const faqs = parseJson<Faq[]>(post.faqs, []);
  const tags = splitList(post.tags);
  const related = (await getPublishedPosts({ limit: 4, category: post.category ?? undefined })).filter((p) => p.slug !== post.slug).slice(0, 3);
  const path = `/blog/${post.slug}`;
  const published = post.publishedAt ?? post.createdAt;
  // Show an "Updated" date only for a real revision, not the seconds between create and first save.
  const updated = post.updatedAt.getTime() - published.getTime() > 2 * 86_400_000 ? post.updatedAt : null;
  const authorName = site.author.name || post.author;
  const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path }];

  return (
    <>
      <JsonLd data={graph(articleSchema({ path, title: post.title, description: post.excerpt, image: post.coverImage ?? undefined, datePublished: published.toISOString(), dateModified: post.updatedAt.toISOString(), author: post.author, tags, section: post.category, wordCount: post.content.split(/\s+/).filter(Boolean).length }), breadcrumbSchema(crumbs), faqSchema(faqs))} />
      <article>
        <header className="relative overflow-hidden pb-10 pt-6">
          <Container>
            <Breadcrumbs items={crumbs.map((c, i) => (i === 2 ? { ...c, name: "Article" } : c))} />
            <div className="mt-8 max-w-3xl" data-reveal>
              {post.category && <Eyebrow className="mb-5">{post.category}</Eyebrow>}
              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">{post.title}</h1>
              <p className="mt-6 text-pretty text-lg leading-8 text-graphite md:text-xl" data-speakable>{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-[13.5px] text-slate">
                <span className="inline-flex items-center gap-2"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient font-display text-xs font-semibold text-ink">{initials(authorName)}</span> <span>{authorName}{site.author.name && site.author.role ? <span className="text-mist">, {site.author.role}</span> : null}</span></span>
                <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> <time dateTime={published.toISOString()}>{formatDate(published)}</time></span>
                {updated && <span className="inline-flex items-center gap-1.5">Updated <time dateTime={updated.toISOString()}>{formatDate(updated)}</time></span>}
                <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {post.readingMinutes} min read</span>
              </div>
            </div>
          </Container>
        </header>
        <Container>
          <div className="overflow-hidden rounded-[2rem] shadow-glass" data-reveal>
            {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt ?? post.title} className="aspect-[21/9] w-full object-cover" /> : <ProjectTile seed={post.slug} className="aspect-[21/9] w-full" />}
          </div>
        </Container>
        <Section size="sm">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="prose-bb" dangerouslySetInnerHTML={{ __html: html }} />
              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 text-[13px]">
                  <Tag size={14} className="text-gold" />
                  {tags.map((t) => (
                    <span key={t} className="rounded-full bg-gold-pale px-3 py-1 font-medium text-gold-deep">{t}</span>
                  ))}
                </div>
              )}
              {faqs.length > 0 && (
                <div className="mt-14">
                  <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">Frequently asked questions</h2>
                  <FaqAccordion faqs={faqs} />
                </div>
              )}
              {site.author.name && (
                <aside className="mt-12 flex items-start gap-4 rounded-glass border border-ink/5 bg-white/60 p-6" aria-label="About the author">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-gradient font-display text-sm font-semibold text-ink">{initials(site.author.name)}</span>
                  <div className="text-[14.5px] leading-7 text-graphite">
                    <p className="font-display text-[16px] font-semibold text-ink">
                      Written by {site.author.url ? <a href={site.author.url} rel="author noopener" target="_blank" className="hover:text-gold-deep">{site.author.name}</a> : site.author.name}
                      {site.author.role ? <span className="font-sans text-[14px] font-normal text-slate"> · {site.author.role}, {site.name}</span> : null}
                    </p>
                    {site.author.bio && <p className="mt-1">{site.author.bio}</p>}
                  </div>
                </aside>
              )}
              <InlineCta text="Want help putting this into practice?" cta="Talk to a strategist" />
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-5">
                {headings.length > 1 && (
                  <nav className="glass rounded-glass p-6" aria-label="Table of contents">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">In this article</p>
                    <ol className="mt-3 space-y-2 text-[14px]">
                      {headings.map((h) => (
                        <li key={h.id}><a href={`#${h.id}`} className="text-graphite transition-colors hover:text-gold-deep">{h.text}</a></li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div className="glass-dark rounded-glass p-6 text-paper">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">Free growth audit</p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight">See what&apos;s holding your growth back.</p>
                  <p className="mt-2 text-[14px] text-paper/65">Website, rankings, ads and brand reviewed by a senior strategist.</p>
                  <Link href="/contact" className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-gold-gradient px-6 text-[14px] font-semibold text-ink" data-track="cta_blog_sidebar">Request audit</Link>
                </div>
              </div>
            </aside>
          </div>
        </Section>
      </article>
      {related.length > 0 && (
        <Section tone="cream" size="sm">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-ink">Keep reading</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} p={p} />
            ))}
          </div>
        </Section>
      )}
      <CtaBanner compact />
    </>
  );
}
