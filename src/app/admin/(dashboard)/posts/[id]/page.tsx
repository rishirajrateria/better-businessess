import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/Forms";

export const dynamic = "force-dynamic";

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const post = await prisma.post.findUnique({ where: { id: (await params).id } });
  if (!post) notFound();
  const saved = (await searchParams).saved;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><Link href="/admin/posts" className="text-[13px] font-semibold text-slate hover:text-ink">← All posts</Link>{post.published && <a href={`/blog/${post.slug}`} target="_blank" className="text-[13px] font-semibold text-gold-deep hover:underline">View live →</a>}</div>
      {saved && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13.5px] text-emerald-700">Saved successfully.</p>}
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Edit post</h1>
      <PostForm post={post} />
    </div>
  );
}
