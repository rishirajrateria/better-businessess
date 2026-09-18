import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/site/ServicePage";
import { JsonLd } from "@/components/site/JsonLd";
import { coreServices, getService } from "@/lib/services";
import { provinces, majorCities } from "@/lib/locations";
import { serviceCountryContent } from "@/lib/content";
import { getTestimonials, getPublishedProjects } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/seo";

export const revalidate = 3600;
export function generateStaticParams() {
  return coreServices.map((s) => ({ service: s.slug }));
}
type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).service);
  if (!s?.core) return {};
  const c = serviceCountryContent(s);
  return buildMetadata({ title: c.title, description: c.description, path: `/services/${s.slug}/canada`, keywords: s.keywords });
}

export default async function ServiceCanadaPage({ params }: Props) {
  const s = getService((await params).service);
  if (!s?.core) notFound();
  const c = serviceCountryContent(s);
  const path = `/services/${s.slug}/canada`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }, { name: "Canada", path }];
  const [testimonials, projects] = await Promise.all([getTestimonials({ service: s.slug, limit: 3 }), getPublishedProjects({ service: s.slug, limit: 3 })]);
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: c.title, description: c.description }), serviceSchema(s, { path, areaName: "Canada", areaType: "Country", description: c.description }), breadcrumbSchema(crumbs), faqSchema(c.faqs))} />
      <ServicePageTemplate
        service={s}
        crumbs={crumbs}
        eyebrow={`${s.name} · Canada`}
        h1={<>{s.name} services <span className="text-gold-gradient">across Canada.</span></>}
        subtitle={c.description}
        intro={c.intro}
        faqs={c.faqs}
        keyFacts={c.keyFacts}
        testimonials={testimonials}
        projects={projects}
        locationName="Canada"
        provinceLinks={{ provinces, hrefFor: (p) => `/services/${s.slug}/${p.slug}`, title: <>{s.name} in every <span className="text-gold-gradient">province and territory.</span></> }}
        cityLinks={{ cities: majorCities, hrefFor: (ci) => `/services/${s.slug}/${ci.province}/${ci.slug}`, title: <>{s.name} in <span className="text-gold-gradient">major cities.</span></> }}
        siblingLinks={coreServices.filter((x) => x.slug !== s.slug).map((x) => ({ label: `${x.name} in Canada`, href: `/services/${x.slug}/canada` }))}
      />
    </>
  );
}
