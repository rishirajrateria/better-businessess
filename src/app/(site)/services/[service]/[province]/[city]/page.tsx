import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/site/ServicePage";
import { JsonLd } from "@/components/site/JsonLd";
import { coreServices, getService } from "@/lib/services";
import { cities, getCity, getProvince } from "@/lib/locations";
import { serviceCityContent } from "@/lib/content";
import { getTestimonials, getPublishedProjects } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, placeSchema, serviceSchema, webPageSchema } from "@/lib/seo";

export const revalidate = 86400;
export function generateStaticParams() {
  return coreServices.flatMap((s) => cities.map((c) => ({ service: s.slug, province: c.province, city: c.slug })));
}
type Props = { params: Promise<{ service: string; province: string; city: string }> };

async function resolve(params: Props["params"]) {
  const { service, province, city } = await params;
  const s = getService(service);
  const c = getCity(city);
  const p = getProvince(province);
  if (!s?.core || !c || !p || c.province !== p.slug) return null;
  return { s, c, p };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const content = serviceCityContent(r.s, r.c);
  return buildMetadata({ title: content.title, description: content.description, path: `/services/${r.s.slug}/${r.p.slug}/${r.c.slug}`, keywords: r.s.keywords.map((k) => `${k} ${r.c.name}`) });
}

export default async function ServiceCityPage({ params }: Props) {
  const r = await resolve(params);
  if (!r) notFound();
  const { s, c, p } = r;
  const content = serviceCityContent(s, c);
  const path = `/services/${s.slug}/${p.slug}/${c.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }, { name: p.name, path: `/services/${s.slug}/${p.slug}` }, { name: c.name, path }];
  const [testimonials, projects] = await Promise.all([getTestimonials({ service: s.slug, limit: 3 }), getPublishedProjects({ service: s.slug, limit: 3 })]);

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: content.title, description: content.description }), serviceSchema(s, { path, areaName: `${c.name}, ${p.code}`, areaType: "City", description: content.description }), placeSchema(c, p), breadcrumbSchema(crumbs), faqSchema(content.faqs))} />
      <ServicePageTemplate
        service={s}
        crumbs={crumbs}
        eyebrow={content.eyebrow}
        h1={<>{s.name} in <span className="text-gold-gradient">{c.name}</span>{content.h1.includes(p.code) ? `, ${p.code}` : ""}</>}
        subtitle={content.description}
        intro={content.intro}
        angles={content.angles}
        whySection={content.whySection}
        industries={content.industries}
        faqs={content.faqs}
        keyFacts={content.keyFacts}
        testimonials={testimonials}
        projects={projects}
        locationName={c.name}
        defaultCity={`${c.name}, ${p.code}`}
        cityLinks={{ cities: content.nearby, hrefFor: (ci) => `/services/${s.slug}/${ci.province}/${ci.slug}`, title: <>{s.name} near <span className="text-gold-gradient">{c.name}.</span></>, eyebrow: "Nearby markets", subtitle: `We also serve these communities close to ${c.name}.`, columns: 3 }}
        siblingLinks={[
          { label: `All services in ${c.name}`, href: `/locations/${p.slug}/${c.slug}` },
          { label: `${s.name} in ${p.name}`, href: `/services/${s.slug}/${p.slug}` },
          ...content.siblingServices.map((x) => ({ label: `${x.name} in ${c.name}`, href: `/services/${x.slug}/${p.slug}/${c.slug}` })),
          ...content.subServices.map((x) => ({ label: x.name, href: `/services/${x.slug}` })),
        ]}
      />
    </>
  );
}
