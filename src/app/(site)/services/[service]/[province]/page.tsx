import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/site/ServicePage";
import { JsonLd } from "@/components/site/JsonLd";
import { coreServices, getService } from "@/lib/services";
import { provinces, getProvince } from "@/lib/locations";
import { serviceProvinceContent } from "@/lib/content";
import { getTestimonials, getPublishedProjects } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, placeSchema, serviceSchema, webPageSchema } from "@/lib/seo";

export const revalidate = 86400;
export function generateStaticParams() {
  return coreServices.flatMap((s) => provinces.map((p) => ({ service: s.slug, province: p.slug })));
}
type Props = { params: Promise<{ service: string; province: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service, province } = await params;
  const s = getService(service);
  const p = getProvince(province);
  if (!s?.core || !p) return {};
  const c = serviceProvinceContent(s, p);
  return buildMetadata({ title: c.title, description: c.description, path: `/services/${s.slug}/${p.slug}`, keywords: [...s.keywords.map((k) => `${k} ${p.name}`)] });
}

export default async function ServiceProvincePage({ params }: Props) {
  const { service, province } = await params;
  const s = getService(service);
  const p = getProvince(province);
  if (!s?.core || !p) notFound();
  const c = serviceProvinceContent(s, p);
  const path = `/services/${s.slug}/${p.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }, { name: p.name, path }];
  const [testimonials, projects] = await Promise.all([getTestimonials({ service: s.slug, limit: 3 }), getPublishedProjects({ service: s.slug, limit: 3 })]);
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: c.title, description: c.description }), serviceSchema(s, { path, areaName: p.name, areaType: "State", description: c.description }), placeSchema(undefined, p), breadcrumbSchema(crumbs), faqSchema(c.faqs))} />
      <ServicePageTemplate
        service={s}
        crumbs={crumbs}
        eyebrow={`${s.name} · ${p.name}`}
        h1={<>{c.h1.replace(p.name, "")}<span className="text-gold-gradient">{p.name}</span></>}
        subtitle={c.description}
        intro={c.intro}
        faqs={c.faqs}
        keyFacts={c.keyFacts}
        testimonials={testimonials}
        projects={projects}
        locationName={p.name}
        cityLinks={{ cities: c.cities, hrefFor: (ci) => `/services/${s.slug}/${p.slug}/${ci.slug}`, title: <>{s.name} in <span className="text-gold-gradient">{p.name} cities.</span></>, subtitle: `Dedicated ${s.noun} pages for every ${p.name} market we serve.` }}
        provinceLinks={{ provinces: provinces.filter((x) => x.slug !== p.slug), hrefFor: (x) => `/services/${s.slug}/${x.slug}`, title: <>{s.name} in <span className="text-gold-gradient">other provinces.</span></> }}
        siblingLinks={[{ label: `About ${p.name}`, href: `/locations/${p.slug}` }, { label: `${s.name} across Canada`, href: `/services/${s.slug}/canada` }, ...coreServices.filter((x) => x.slug !== s.slug).map((x) => ({ label: `${x.name} in ${p.name}`, href: `/services/${x.slug}/${p.slug}` }))]}
      />
    </>
  );
}
