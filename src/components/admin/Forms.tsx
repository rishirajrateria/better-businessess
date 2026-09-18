"use client";
import { useActionState } from "react";
import { Field, Input, Textarea, Select, Checkbox, SubmitButton, Notice, DeleteButton } from "./ui";
import { MarkdownEditor } from "./MarkdownEditor";
import { savePostAction, saveProjectAction, saveTestimonialAction, saveLogoAction, saveFaqAction, deletePostAction, deleteProjectAction, deleteTestimonialAction, deleteLogoAction, deleteFaqAction, type ActionState } from "@/lib/admin-actions";
import { services } from "@/lib/services";
import { parseJson, splitList } from "@/lib/queries";
import type { Post, Project, Testimonial, ClientLogo, Faq } from "@/prisma-types";

const toDateInput = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const faqsToText = (s?: string | null) => parseJson<{ question: string; answer: string }[]>(s, []).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
const pairsToText = (s?: string | null) => parseJson<{ label: string; value: string }[]>(s, []).map((r) => `${r.label}: ${r.value}`).join("\n");
const linesToText = (s?: string | null) => parseJson<string[]>(s, []).join("\n");

/* ---------------- Post ---------------- */
export function PostForm({ post }: { post?: Post | null }) {
  const [state, action] = useActionState<ActionState, FormData>(savePostAction, undefined);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-12">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <div className="space-y-5 lg:col-span-8">
        <Field label="Title *" name="title"><Input name="title" required defaultValue={post?.title} placeholder="How Toronto contractors can double their leads with Google Ads" /></Field>
        <Field label="Excerpt" name="excerpt" hint="1–2 sentences shown in cards and used as the meta description fallback."><Textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className="!font-sans !text-[14px]" /></Field>
        <MarkdownEditor name="content" defaultValue={post?.content ?? ""} required />
        <Field label="FAQs (optional, boosts SEO)" name="faqs" hint={"One per block: 'Q: question' on one line, 'A: answer' on the next. Rendered with FAQ schema."}><Textarea name="faqs" rows={6} defaultValue={faqsToText(post?.faqs)} placeholder={"Q: How much does SEO cost?\nA: Typically CAD $1,200 to $5,000 per month."} /></Field>
      </div>
      <div className="space-y-5 lg:col-span-4">
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <div className="flex flex-wrap gap-4"><Checkbox name="published" label="Published" defaultChecked={post?.published ?? false} /><Checkbox name="featured" label="Featured" defaultChecked={post?.featured ?? false} /></div>
          <Field label="Publish date" name="publishedAt"><Input type="date" name="publishedAt" defaultValue={toDateInput(post?.publishedAt)} /></Field>
          <Field label="Slug" name="slug" hint="Leave blank to generate from the title."><Input name="slug" defaultValue={post?.slug} placeholder="auto" /></Field>
          <Field label="Category" name="category"><Input name="category" defaultValue={post?.category ?? ""} placeholder="SEO, Lead Generation, Web Design…" /></Field>
          <Field label="Tags" name="tags" hint="Comma separated."><Input name="tags" defaultValue={post?.tags ?? ""} placeholder="google ads, toronto, contractors" /></Field>
          <Field label="Author" name="author"><Input name="author" defaultValue={post?.author ?? "Better Businesses"} /></Field>
          <Field label="Reading minutes" name="readingMinutes" hint="Leave 0 to auto-calculate."><Input type="number" name="readingMinutes" defaultValue={post?.readingMinutes ?? 0} min={0} /></Field>
        </div>
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <Field label="Cover image URL" name="coverImage" hint="Paste a hosted image URL (e.g. Cloudinary, Vercel Blob, your CDN)."><Input name="coverImage" defaultValue={post?.coverImage ?? ""} placeholder="https://…/image.jpg" /></Field>
          <Field label="Cover alt text" name="coverAlt"><Input name="coverAlt" defaultValue={post?.coverAlt ?? ""} /></Field>
        </div>
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <Field label="SEO title" name="seoTitle" hint="Under 60 characters. Defaults to the title."><Input name="seoTitle" defaultValue={post?.seoTitle ?? ""} maxLength={70} /></Field>
          <Field label="SEO description" name="seoDescription" hint="Under 160 characters."><Textarea name="seoDescription" rows={3} defaultValue={post?.seoDescription ?? ""} className="!font-sans !text-[14px]" maxLength={180} /></Field>
        </div>
        <Notice state={state} />
        <div className="flex items-center justify-between gap-3">
          <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
          {post && <DeleteButton action={deletePostAction} id={post.id} confirmText="Delete this post permanently?" />}
        </div>
      </div>
    </form>
  );
}

/* ---------------- Project ---------------- */
export function ProjectForm({ project }: { project?: Project | null }) {
  const [state, action] = useActionState<ActionState, FormData>(saveProjectAction, undefined);
  const selected = new Set(splitList(project?.services));
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-12">
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <div className="space-y-5 lg:col-span-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project title *" name="title"><Input name="title" required defaultValue={project?.title} placeholder="312% more booked jobs for a Calgary HVAC company" /></Field>
          <Field label="Client *" name="client"><Input name="client" required defaultValue={project?.client} placeholder="Northwind Heating & Cooling" /></Field>
          <Field label="Industry" name="industry"><Input name="industry" defaultValue={project?.industry ?? ""} placeholder="Home services" /></Field>
          <Field label="Location" name="location"><Input name="location" defaultValue={project?.location ?? ""} placeholder="Calgary, AB" /></Field>
        </div>
        <Field label="Summary *" name="summary" hint="Shown on cards and as the intro."><Textarea name="summary" rows={3} required defaultValue={project?.summary} className="!font-sans !text-[14px]" /></Field>
        <Field label="Results" name="results" hint={"One per line as 'Label: Value' (e.g. 'Cost per lead: -42%')."}><Textarea name="results" rows={4} defaultValue={pairsToText(project?.results)} placeholder={"Leads per month: 3.1x\nCost per lead: -42%\nRevenue growth: +$480k"} /></Field>
        <MarkdownEditor name="challenge" label="The challenge (Markdown)" rows={6} defaultValue={project?.challenge ?? ""} />
        <MarkdownEditor name="solution" label="What we did (Markdown)" rows={8} defaultValue={project?.solution ?? ""} />
        <MarkdownEditor name="content" label="Additional content (Markdown, optional)" rows={6} defaultValue={project?.content ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Testimonial quote" name="testimonial"><Textarea name="testimonial" rows={3} defaultValue={project?.testimonial ?? ""} className="!font-sans !text-[14px]" /></Field>
          <Field label="Testimonial by" name="testimonialBy"><Input name="testimonialBy" defaultValue={project?.testimonialBy ?? ""} placeholder="Jane Doe, Owner" /></Field>
        </div>
      </div>
      <div className="space-y-5 lg:col-span-4">
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <div className="flex flex-wrap gap-4"><Checkbox name="published" label="Published" defaultChecked={project?.published ?? false} /><Checkbox name="featured" label="Featured on homepage" defaultChecked={project?.featured ?? false} /></div>
          <Field label="Services" name="services">
            <div className="grid gap-1.5">
              {services.map((s) => (
                <label key={s.slug} className="inline-flex items-center gap-2 text-[13.5px] text-graphite"><input type="checkbox" name="services" value={s.slug} defaultChecked={selected.has(s.slug)} className="h-4 w-4 accent-gold" /> {s.name}</label>
              ))}
            </div>
          </Field>
          <Field label="Completed" name="completedAt"><Input type="date" name="completedAt" defaultValue={toDateInput(project?.completedAt)} /></Field>
          <Field label="Sort order" name="sortOrder"><Input type="number" name="sortOrder" defaultValue={project?.sortOrder ?? 0} /></Field>
          <Field label="Slug" name="slug"><Input name="slug" defaultValue={project?.slug} placeholder="auto" /></Field>
          <Field label="Website URL" name="websiteUrl"><Input name="websiteUrl" defaultValue={project?.websiteUrl ?? ""} placeholder="https://" /></Field>
        </div>
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <Field label="Cover image URL" name="coverImage"><Input name="coverImage" defaultValue={project?.coverImage ?? ""} placeholder="https://…" /></Field>
          <Field label="Cover alt" name="coverAlt"><Input name="coverAlt" defaultValue={project?.coverAlt ?? ""} /></Field>
          <Field label="Gallery image URLs" name="gallery" hint="One URL per line."><Textarea name="gallery" rows={3} defaultValue={linesToText(project?.gallery)} /></Field>
          <Field label="Accent colour (used when no image)" name="accentColor"><Input name="accentColor" defaultValue={project?.accentColor ?? ""} placeholder="#C19A3E" /></Field>
        </div>
        <div className="rounded-3xl border border-ink/5 bg-white p-5 space-y-4">
          <Field label="SEO title" name="seoTitle"><Input name="seoTitle" defaultValue={project?.seoTitle ?? ""} /></Field>
          <Field label="SEO description" name="seoDescription"><Textarea name="seoDescription" rows={3} defaultValue={project?.seoDescription ?? ""} className="!font-sans !text-[14px]" /></Field>
        </div>
        <Notice state={state} />
        <div className="flex items-center justify-between gap-3">
          <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
          {project && <DeleteButton action={deleteProjectAction} id={project.id} />}
        </div>
      </div>
    </form>
  );
}

/* ---------------- Testimonial ---------------- */
export function TestimonialForm({ t }: { t?: Testimonial | null }) {
  const [state, action] = useActionState<ActionState, FormData>(saveTestimonialAction, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={t?.id ?? ""} />
      <Field label="Name *" name={`name-${t?.id}`}><Input name="name" required defaultValue={t?.name} /></Field>
      <Field label="Role" name="role"><Input name="role" defaultValue={t?.role ?? ""} placeholder="Owner" /></Field>
      <Field label="Company" name="company"><Input name="company" defaultValue={t?.company ?? ""} /></Field>
      <Field label="Location" name="location"><Input name="location" defaultValue={t?.location ?? ""} placeholder="Vancouver, BC" /></Field>
      <Field label="Quote *" name="quote" className="sm:col-span-2"><Textarea name="quote" rows={3} required defaultValue={t?.quote} className="!font-sans !text-[14px]" /></Field>
      <Field label="Rating (1–5)" name="rating"><Input type="number" name="rating" min={1} max={5} defaultValue={t?.rating ?? 5} /></Field>
      <Field label="Related service" name="service"><Select name="service" defaultValue={t?.service ?? ""}><option value="">All services</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</Select></Field>
      <Field label="Avatar URL" name="avatarUrl"><Input name="avatarUrl" defaultValue={t?.avatarUrl ?? ""} placeholder="https://…" /></Field>
      <Field label="Sort order" name="sortOrder"><Input type="number" name="sortOrder" defaultValue={t?.sortOrder ?? 0} /></Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2"><Checkbox name="published" label="Published" defaultChecked={t?.published ?? true} /><Checkbox name="featured" label="Featured" defaultChecked={t?.featured ?? false} /></div>
      <div className="sm:col-span-2"><Notice state={state} /></div>
      <div className="flex items-center justify-between sm:col-span-2"><SubmitButton>{t ? "Save" : "Add testimonial"}</SubmitButton>{t && <DeleteButton action={deleteTestimonialAction} id={t.id} />}</div>
    </form>
  );
}

/* ---------------- Logo ---------------- */
export function LogoForm({ l }: { l?: ClientLogo | null }) {
  const [state, action] = useActionState<ActionState, FormData>(saveLogoAction, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={l?.id ?? ""} />
      <Field label="Client name *" name="name"><Input name="name" required defaultValue={l?.name} /></Field>
      <Field label="Logo image URL" name="logoUrl" hint="SVG or PNG. Leave blank to show the name as a wordmark."><Input name="logoUrl" defaultValue={l?.logoUrl ?? ""} placeholder="https://…/logo.svg" /></Field>
      <Field label="Website" name="website"><Input name="website" defaultValue={l?.website ?? ""} placeholder="https://" /></Field>
      <Field label="Sort order" name="sortOrder"><Input type="number" name="sortOrder" defaultValue={l?.sortOrder ?? 0} /></Field>
      <div className="sm:col-span-2"><Checkbox name="published" label="Published" defaultChecked={l?.published ?? true} /></div>
      <div className="sm:col-span-2"><Notice state={state} /></div>
      <div className="flex items-center justify-between sm:col-span-2"><SubmitButton>{l ? "Save" : "Add logo"}</SubmitButton>{l && <DeleteButton action={deleteLogoAction} id={l.id} />}</div>
    </form>
  );
}

/* ---------------- FAQ ---------------- */
export function FaqForm({ f }: { f?: Faq | null }) {
  const [state, action] = useActionState<ActionState, FormData>(saveFaqAction, undefined);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={f?.id ?? ""} />
      <Field label="Question *" name="question"><Input name="question" required defaultValue={f?.question} /></Field>
      <Field label="Answer *" name="answer"><Textarea name="answer" rows={3} required defaultValue={f?.answer} className="!font-sans !text-[14px]" /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Shown on" name="category"><Select name="category" defaultValue={f?.category ?? "general"}><option value="general">Homepage & FAQ page (general)</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name} page</option>)}</Select></Field>
        <Field label="Sort order" name="sortOrder"><Input type="number" name="sortOrder" defaultValue={f?.sortOrder ?? 0} /></Field>
        <div className="flex items-end pb-2"><Checkbox name="published" label="Published" defaultChecked={f?.published ?? true} /></div>
      </div>
      <Notice state={state} />
      <div className="flex items-center justify-between"><SubmitButton>{f ? "Save" : "Add FAQ"}</SubmitButton>{f && <DeleteButton action={deleteFaqAction} id={f.id} />}</div>
    </form>
  );
}
