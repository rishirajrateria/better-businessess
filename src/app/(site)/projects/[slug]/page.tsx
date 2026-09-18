import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Quote } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProjectCard } from "@/components/site/Cards";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectTile } from "@/components/site/Visuals";
import { InlineCta } from "@/components/site/Sections";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { getProjectBySlug, getPublishedProjects, parseJson, splitList } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import { breadcrumbSchema, buildMetadata, graph, webPageSchema } from "@/lib/seo";
import { getService } from "@/lib/services";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() {
  try {
    return (await prisma.project.findMany({ where: { published: true }, select: { slug: true } })).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle || `${p.title} | Case Study`, description: p.seoDescription || p.summary, path: `/projects/${p.slug}`, type: "article", image: p.coverImage ?? undefined });
}

export default async function ProjectPage({ params }: Props) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  const results = parseJson<{ label: string; value: string }[]>(p.results, []);
  const gallery = parseJson<string[]>(p.gallery, []);
  const svcs = splitList(p.services).map((s) => getService(s)).filter(Boolean);
  const related = (await getPublishedProjects({ limit: 4 })).filter((x) => x.slug !== p.slug).slice(0, 3);
  const path = `/projects/${p.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: p.title, path }];

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: p.title, description: p.summary }), breadcrumbSchema(crumbs), { "@type": "CreativeWork", name: p.title, description: p.summary, url: `${site.url}${path}`, creator: { "@id": `${site.url}/#organization` }, ...(p.coverImage ? { image: p.coverImage } : {}), ...(p.completedAt ? { dateCreated: p.completedAt.toISOString() } : {}) })} />
      <article>
        <header className="pb-10 pt-6">
          <Container>
            <Breadcrumbs items={crumbs} />
            <div className="mt-8 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8" data-reveal>
                <Eyebrow className="mb-5">Case study{p.industry ? ` · ${p.industry}` : ""}</Eyebrow>
                <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">{p.title}</h1>
                <p className="mt-6 text-pretty text-lg leading-8 text-graphite md:text-xl" data-speakable>{p.summary}</p>
              </div>
              <dl className="glass rounded-glass p-6 text-[14.5px] lg:col-span-4" data-reveal data-reveal-delay={100}>
                <div className="flex justify-between border-b border-line py-2"><dt className="text-slate">Client</dt><dd className="font-semibold text-ink">{p.client}</dd></div>
                {p.location && <div className="flex justify-between border-b border-line py-2"><dt className="text-slate">Location</dt><dd className="font-semibold text-ink">{p.location}</dd></div>}
                {p.completedAt && <div className="flex justify-between border-b border-line py-2"><dt className="text-slate">Completed</dt><dd className="font-semibold text-ink">{formatDate(p.completedAt, { year: "numeric", month: "short" })}</dd></div>}
                <div className="py-2"><dt className="text-slate">Services</dt><dd className="mt-2 flex flex-wrap gap-2">{svcs.map((s) => <Link key={s!.slug} href={`/services/${s!.slug}`} className="rounded-full bg-gold-pale px-3 py-1 text-[13px] font-medium text-gold-deep">{s!.name}</Link>)}</dd></div>
                {p.websiteUrl && <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-ink hover:text-gold-deep">Visit website <ArrowUpRight size={15} /></a>}
              </dl>
            </div>
          </Container>
        </header>
        <Container>
          <div className="overflow-hidden rounded-[2rem] shadow-glass" data-reveal>
            {p.coverImage ? <img src={p.coverImage} alt={p.coverAlt ?? p.title} className="aspect-[21/9] w-full object-cover" /> : <ProjectTile seed={p.slug} accent={p.accentColor ?? undefined} className="aspect-[21/9] w-full" title={p.client} />}
          </div>
        </Container>
        {results.length > 0 && (
          <Section size="sm">
            <div className="grid gap-4 sm:grid-cols-3">
              {results.map((r, i) => (
                <div key={r.label} data-reveal data-reveal-delay={i * 80} className="glass-dark rounded-glass p-7 text-center text-paper">
                  <p className="font-display text-4xl font-semibold text-gold-gradient md:text-5xl">{r.value}</p>
                  <p className="mt-2 text-[13.5px] text-paper/70">{r.label}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
        <Section size="sm">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              {p.challenge && <div><h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">The challenge</h2><div className="prose-bb mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.challenge) }} /></div>}
              {p.solution && <div><h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">What we did</h2><div className="prose-bb mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.solution) }} /></div>}
              {p.content && <div className="prose-bb" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />}
              {gallery.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((g, i) => <img key={g} src={g} alt={`${p.title} — image ${i + 1}`} className="w-full rounded-2xl object-cover shadow-glass" loading="lazy" />)}
                </div>
              )}
              <InlineCta text="Want results like these?" />
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-5">
                {p.testimonial && (
                  <figure className="glass rounded-glass p-6">
                    <Quote size={20} className="text-gold" />
                    <blockquote className="mt-3 text-[15.5px] leading-7 text-ink-soft">“{p.testimonial}”</blockquote>
                    {p.testimonialBy && <figcaption className="mt-3 text-[13px] font-semibold text-slate">{p.testimonialBy}</figcaption>}
                  </figure>
                )}
                <div className="glass-dark rounded-glass p-6 text-paper">
                  <p className="font-display text-xl font-semibold tracking-tight">Your project could be next.</p>
                  <p className="mt-2 text-[14px] text-paper/65">Free audit, fixed pricing, senior team.</p>
                  <Button href="/contact" variant="gold" className="mt-4 w-full" track="cta_project_sidebar">Start a project <ArrowIcon /></Button>
                </div>
              </div>
            </aside>
          </div>
        </Section>
      </article>
      {related.length > 0 && (
        <Section tone="cream" size="sm">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-ink">More projects</h2>
          <div className="grid gap-5 md:grid-cols-3">{related.map((r) => <ProjectCard key={r.id} p={r} />)}</div>
        </Section>
      )}
      <CtaBanner compact />
    </>
  );
}
