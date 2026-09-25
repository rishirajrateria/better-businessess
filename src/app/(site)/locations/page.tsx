import type { Metadata } from "next";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CityLinks, ProvinceLinks, ServicesGrid } from "@/components/site/Sections";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { Section } from "@/components/ui/Section";
import { provinces, cities } from "@/lib/locations";
import { buildMetadata, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Locations We Serve Across Canada";
const description = `${site.name} serves businesses in all 10 provinces and 3 territories. Find lead generation, SEO, web development and branding services for your city.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/locations" });

export default function LocationsPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/locations", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Service areas" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Local strategy for <span className="text-gold-gradient">every Canadian market.</span></>} subtitle={`From Vancouver to St. John's and Whitehorse to Windsor, ${site.name} builds digital growth systems tuned to how customers in each region search, compare and buy.`} />
      <Section size="sm">
        <KeyFacts facts={[`${site.name} serves all of Canada: ${provinces.filter((p) => p.type === "province").length} provinces and ${provinces.filter((p) => p.type === "territory").length} territories.`, `Dedicated local pages for ${cities.length} cities and ${provinces.length} provinces/territories.`, `Headquartered in ${site.hq.city}, ${site.hq.province}; clients served remotely nationwide with bilingual deliverables.`]} />
      </Section>
      <ProvinceLinks provinces={provinces} hrefFor={(p) => `/locations/${p.slug}`} title={<>Provinces and <span className="text-gold-gradient">territories.</span></>} subtitle="Choose your province for local market insight and city pages." />
      <CityLinks cities={cities} hrefFor={(c) => `/locations/${c.province}/${c.slug}`} title={<>All cities <span className="text-gold-gradient">we serve.</span></>} eyebrow="Cities" columns={5} />
      <ServicesGrid />
      <CtaBanner />
    </>
  );
}
