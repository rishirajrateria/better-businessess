import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProjectCard } from "@/components/site/Cards";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { StatsStrip } from "@/components/site/Sections";
import { Section } from "@/components/ui/Section";
import { getPublishedProjects } from "@/lib/queries";
import { coreServices } from "@/lib/services";
import { buildMetadata, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 60;
const title = "Projects & Case Studies | Results for Canadian Businesses";
const description = `Explore ${site.name} case studies: lead generation, SEO, website development and branding projects with measurable results for Canadian companies.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/projects" });

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const sp = await searchParams;
  const projects = await getPublishedProjects({ service: sp.service });
  const crumbs = [{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/projects", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs))} />
      <PageHero compact eyebrow="Selected work" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Work that moved <span className="text-gold-gradient">real numbers.</span></>} subtitle="A selection of projects across lead generation, SEO, web development and branding for Canadian businesses." />
      <Section size="sm">
        <StatsStrip items={[{ label: "Projects delivered", value: site.stats.projects }, { label: "Leads generated", value: site.stats.leadsGenerated }, { label: "Average ROI", value: site.stats.avgRoi }, { label: "Client retention", value: site.stats.retention }]} />
      </Section>
      <Section size="sm">
        <div className="mb-8 flex flex-wrap gap-2" data-reveal>
          <Link href="/projects" className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium", !sp.service ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>All</Link>
          {coreServices.map((s) => (
            <Link key={s.slug} href={`/projects?service=${s.slug}`} className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium", sp.service === s.slug ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>{s.name}</Link>
          ))}
        </div>
        {projects.length === 0 ? (
          <div className="glass rounded-glass p-12 text-center" data-reveal>
            <p className="font-display text-2xl font-semibold text-ink">Case studies coming soon.</p>
            <p className="mt-2 text-slate">We are documenting recent results. <Link href="/contact" className="font-semibold text-gold-deep">Ask us for examples</Link> in your industry.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={(i % 3) * 80}><ProjectCard p={p} /></div>
            ))}
          </div>
        )}
      </Section>
      <CtaBanner title={<>Want results like these <span className="text-gold-gradient">for your business?</span></>} />
    </>
  );
}
