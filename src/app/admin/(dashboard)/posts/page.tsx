import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/Charts";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PostsAdmin() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Blog posts</h1><p className="text-[14px] text-slate">Publish articles with Markdown, FAQs and SEO metadata.</p></div>
        <Link href="/admin/posts/new" className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper hover:bg-ink-soft">+ New post</Link>
      </div>
      <Card>
        {posts.length === 0 ? <p className="text-[13.5px] text-slate">No posts yet. Create your first article.</p> : (
          <table className="w-full text-[13.5px]">
            <thead><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">Title</th><th className="py-2 pr-4">Category</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Published</th><th className="py-2">Updated</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-line hover:bg-cream/50">
                  <td className="py-3 pr-4"><Link href={`/admin/posts/${p.id}`} className="font-semibold text-ink hover:text-gold-deep">{p.title}</Link><br /><a href={`/blog/${p.slug}`} target="_blank" className="text-slate hover:text-gold-deep">/blog/{p.slug}</a></td>
                  <td className="py-3 pr-4">{p.category ?? "—"}</td>
                  <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${p.published ? "bg-emerald-50 text-emerald-700" : "bg-cream text-graphite"}`}>{p.published ? "Published" : "Draft"}</span>{p.featured && <span className="ml-2 rounded-full bg-gold-pale px-2.5 py-1 text-[11.5px] font-semibold text-gold-deep">Featured</span>}</td>
                  <td className="py-3 pr-4 text-slate">{formatDate(p.publishedAt, { dateStyle: "medium" }) || "—"}</td>
                  <td className="py-3 text-slate">{formatDate(p.updatedAt, { dateStyle: "medium" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
