import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services, coreServices } from "@/lib/services";
import { provinces, cities as allCities, isCityIndexable } from "@/lib/locations";
import { prisma } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fixed copy carries a real "last changed" date (see site.staticContentUpdated) instead of the
  // build time, so <lastmod> stays trustworthy. CMS entries use their own updatedAt below.
  const staticDate = new Date(site.staticContentUpdated);
  const cities = allCities.filter(isCityIndexable);
  const u = (p: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", lastModified: Date = staticDate) => ({ url: `${site.url}${p}`, lastModified, changeFrequency, priority });

  let latestPost: Date | undefined;
  try {
    latestPost = (await prisma.post.findFirst({ where: { published: true }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }))?.updatedAt;
  } catch {}
  const listingDate = latestPost && latestPost > staticDate ? latestPost : staticDate;
  const staticPages = [u("/", 1, "weekly", listingDate), u("/services", 0.9, "weekly"), u("/about", 0.7), u("/contact", 0.9), u("/faq", 0.7), u("/locations", 0.8), u("/industries", 0.8, "weekly", listingDate), u("/blog", 0.8, "daily", listingDate), u("/projects", 0.8, "weekly"), u("/privacy", 0.2, "yearly"), u("/terms", 0.2, "yearly")];
  const servicePages = services.map((s) => u(`/services/${s.slug}`, 0.9, "weekly"));
  const countryPages = coreServices.map((s) => u(`/services/${s.slug}/canada`, 0.8));
  const provincePages = provinces.map((p) => u(`/locations/${p.slug}`, 0.7));
  const cityPages = cities.map((c) => u(`/locations/${c.province}/${c.slug}`, 0.6));
  const serviceProvince = coreServices.flatMap((s) => provinces.map((p) => u(`/services/${s.slug}/${p.slug}`, 0.7)));
  const serviceCity = coreServices.flatMap((s) => cities.map((c) => u(`/services/${s.slug}/${c.province}/${c.slug}`, c.major ? 0.7 : 0.6)));

  let posts: MetadataRoute.Sitemap = [];
  let projects: MetadataRoute.Sitemap = [];
  try {
    const [ps, prs] = await Promise.all([prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }), prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })]);
    posts = ps.map((p) => u(`/blog/${p.slug}`, 0.7, "monthly", p.updatedAt));
    projects = prs.map((p) => u(`/projects/${p.slug}`, 0.7, "monthly", p.updatedAt));
  } catch {}

  return [...staticPages, ...servicePages, ...countryPages, ...provincePages, ...cityPages, ...serviceProvince, ...serviceCity, ...posts, ...projects];
}
