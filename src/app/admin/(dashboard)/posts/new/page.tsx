import Link from "next/link";
import { PostForm } from "@/components/admin/Forms";

export default function NewPost() {
  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="text-[13px] font-semibold text-slate hover:text-ink">← All posts</Link>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">New post</h1>
      <PostForm />
    </div>
  );
}
