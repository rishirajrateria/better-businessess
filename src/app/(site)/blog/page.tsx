import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { BlogListing, blogTitle, blogDescription } from "./_listing";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({ title: blogTitle, description: blogDescription, path: "/blog" });

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const sp = await searchParams;
  return <BlogListing page={1} category={sp.category} q={sp.q} />;
}
