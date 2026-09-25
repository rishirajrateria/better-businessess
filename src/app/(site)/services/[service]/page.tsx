import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/site/ServicePage";
import { JsonLd } from "@/components/site/JsonLd";
import { services, getService, getSubServices } from "@/lib/services";
import { provinces, majorCities } from "@/lib/locations";
import { getTestimonials, getPublishedProjects, getFaqs } from "@/lib/queries";
import { getRelatedGuides } from "@/lib/related-guides";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/seo";
import { fit, TITLE_MAX } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;
export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).service);
  if (!s) return {};
  return buildMetadata({ title: fit([`${s.name} Services in Canada`, `${s.shortName} Services in Canada`], TITLE_MAX), description: s.metaDescription, path: `/services/${s.slug}`, keywords: s.keywords });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).service);
  if (!s) notFound();
  const [testimonials, projects, dbFaqs, guides] = await Promise.all([getTestimonials({ service: s.slug, limit: 6 }), getPublishedProjects({ service: s.slug, limit: 3 }), getFaqs(s.slug), getRelatedGuides({ service: s })]);
  const faqs = [...s.faqs, ...dbFaqs];
  const path = `/services/${s.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, ...(s.parent ? [{ name: getService(s.parent)!.name, path: `/services/${s.parent}` }] : []), { name: s.name, path }];
  const subs = getSubServices(s.slug);

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: `${s.name} | ${site.name}`, description: s.metaDescription }), serviceSchema(s, { path }), breadcrumbSchema(crumbs), faqSchema(faqs))} />
      <ServicePageTemplate
        service={s}
        crumbs={crumbs}
        eyebrow={s.parent ? `${getService(s.parent)!.name} · Specialty` : "Core service"}
        h1={<>{s.name} <span className="text-gold-gradient">that delivers.</span></>}
        subtitle={s.tagline + " " + s.metaDescription.split(". ").slice(1).join(". ")}
        intro={s.intro}
        faqs={faqs}
        guides={guides}
        keyFacts={[
          `${site.name} provides ${s.noun} to businesses across Canada.`,
          `Deliverables include ${s.deliverables.slice(0, 4).map((d) => d.toLowerCase()).join(", ")}.`,
          ...(subs.length ? [`Specialties: ${subs.map((x) => x.name).join(", ")}.`] : []),
          `Ideal for ${s.idealFor.slice(0, 3).map((x) => x.toLowerCase()).join(", ")} and more.`,
          `Contact ${site.email}${site.phone ? ` or ${site.phone}` : ""} for a free consultation.`,
        ]}
        testimonials={testimonials}
        projects={projects}
        cityLinks={s.core ? { cities: majorCities, hrefFor: (c) => `/services/${s.slug}/${c.province}/${c.slug}`, title: <>{s.name} in <span className="text-gold-gradient">major Canadian cities.</span></>, subtitle: `Local ${s.noun} pages for the markets we serve most.` } : undefined}
        provinceLinks={s.core ? { provinces, hrefFor: (p) => `/services/${s.slug}/${p.slug}`, title: <>{s.name} by <span className="text-gold-gradient">province and territory.</span></> } : undefined}
        siblingLinks={s.core ? [{ label: `${s.name} across Canada`, href: `/services/${s.slug}/canada` }, ...s.related.map((r) => ({ label: getService(r)?.name ?? r, href: `/services/${r}` }))] : s.related.map((r) => ({ label: getService(r)?.name ?? r, href: `/services/${r}` }))}
      />
    </>
  );
}
