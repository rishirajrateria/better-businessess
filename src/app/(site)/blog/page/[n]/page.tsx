import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { countPublishedPosts } from "@/lib/queries";
import { BlogListing, PAGE_SIZE, blogTitle, blogDescription, blogPagePath } from "../../_listing";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() {
  const total = await countPublishedPosts();
  const pages = Math.ceil(total / PAGE_SIZE);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ n: String(i + 2) }));
}
type Props = { params: Promise<{ n: string }> };

const parsePage = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePage((await params).n);
  if (!Number.isFinite(page) || page < 2) return {};
  return buildMetadata({ title: `${blogTitle} – Page ${page}`, description: `Page ${page} of our guides. ${blogDescription}`, path: blogPagePath(page) });
}

export default async function BlogPageN({ params }: Props) {
  const page = parsePage((await params).n);
  if (!Number.isFinite(page)) notFound();
  if (page < 2) permanentRedirect("/blog");
  const total = await countPublishedPosts();
  if ((page - 1) * PAGE_SIZE >= total) notFound();
  return <BlogListing page={page} />;
}
