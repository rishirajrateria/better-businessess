"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { createSession, destroySession, getSession, hashPassword, verifyCredentials } from "./auth";
import { slugify, readingTime, excerptFrom } from "./markdown";
import bcrypt from "bcryptjs";
import { seedStarterContent } from "./seed-content";

export type ActionState = { ok?: boolean; error?: string; email?: string } | undefined;

async function guard() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  return s;
}
const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const opt = (fd: FormData, k: string) => str(fd, k) || null;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const int = (fd: FormData, k: string, d = 0) => {
  const n = parseInt(str(fd, k), 10);
  return Number.isFinite(n) ? n : d;
};
const date = (fd: FormData, k: string) => {
  const v = str(fd, k);
  return v ? new Date(v) : null;
};
const jsonOrNull = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  try {
    JSON.parse(v);
    return v;
  } catch {
    throw new Error(`"${k}" must be valid JSON`);
  }
};
/** Accept "Label: Value" per line OR JSON array */
const pairsToJson = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  if (v.startsWith("[")) return jsonOrNull(fd, k);
  const rows = v.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : { label: l, value: "" };
  });
  return JSON.stringify(rows);
};
/** Accept "Q: ...\nA: ..." blocks OR JSON */
const faqsToJson = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  if (v.startsWith("[")) return jsonOrNull(fd, k);
  const out: { question: string; answer: string }[] = [];
  let cur: { question: string; answer: string } | null = null;
  for (const line of v.split("\n")) {
    const t = line.trim();
    if (/^q:/i.test(t)) {
      if (cur) out.push(cur);
      cur = { question: t.replace(/^q:\s*/i, ""), answer: "" };
    } else if (/^a:/i.test(t) && cur) cur.answer = t.replace(/^a:\s*/i, "");
    else if (cur && t) cur.answer += (cur.answer ? " " : "") + t;
  }
  if (cur) out.push(cur);
  return JSON.stringify(out);
};
const linesToJson = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (!v) return null;
  if (v.startsWith("[")) return jsonOrNull(fd, k);
  return JSON.stringify(v.split("\n").map((l) => l.trim()).filter(Boolean));
};

/* ---------------- auth ---------------- */
export async function loginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email");
  const password = str(fd, "password");
  if (!email || !password) return { error: "Email and password are required", email };
  const user = await verifyCredentials(email, password).catch(() => null);
  if (!user) return { error: "Invalid email or password", email };
  await createSession(user);
  redirect("/admin");
}
export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
export async function changePasswordAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await guard();
  const current = str(fd, "current");
  const next = str(fd, "next");
  if (next.length < 10) return { error: "New password must be at least 10 characters" };
  const user = await prisma.user.findUnique({ where: { id: s.sub } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is incorrect" };
  await prisma.user.update({ where: { id: s.sub }, data: { passwordHash: await hashPassword(next) } });
  return { ok: true };
}

/* ---------------- leads ---------------- */
export async function updateLeadAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const id = str(fd, "id");
  await prisma.lead.update({ where: { id }, data: { status: str(fd, "status") || "NEW", notes: opt(fd, "notes") } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}
export async function deleteLeadAction(fd: FormData) {
  await guard();
  await prisma.lead.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

/* ---------------- posts ---------------- */
function revalidateSite() {
  revalidatePath("/", "layout");
}
export async function savePostAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  try {
    const id = str(fd, "id");
    const title = str(fd, "title");
    const content = str(fd, "content");
    if (!title || !content) return { error: "Title and content are required" };
    const published = bool(fd, "published");
    const slug = slugify(str(fd, "slug") || title);
    const data = {
      title,
      slug,
      content,
      excerpt: str(fd, "excerpt") || excerptFrom(content),
      coverImage: opt(fd, "coverImage"),
      coverAlt: opt(fd, "coverAlt"),
      category: opt(fd, "category"),
      tags: opt(fd, "tags"),
      author: str(fd, "author") || "Better Businesses",
      readingMinutes: int(fd, "readingMinutes", 0) || readingTime(content),
      seoTitle: opt(fd, "seoTitle"),
      seoDescription: opt(fd, "seoDescription"),
      faqs: faqsToJson(fd, "faqs"),
      published,
      featured: bool(fd, "featured"),
      publishedAt: date(fd, "publishedAt") ?? (published ? new Date() : null),
    };
    const post = id ? await prisma.post.update({ where: { id }, data }) : await prisma.post.create({ data });
    revalidateSite();
    redirect(`/admin/posts/${post.id}?saved=1`);
  } catch (e) {
    if ((e as Error & { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: (e as Error).message.includes("Unique") ? "That slug is already in use" : (e as Error).message };
  }
}
export async function deletePostAction(fd: FormData) {
  await guard();
  await prisma.post.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/posts");
}

/* ---------------- projects ---------------- */
export async function saveProjectAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  try {
    const id = str(fd, "id");
    const title = str(fd, "title");
    const client = str(fd, "client");
    const summary = str(fd, "summary");
    if (!title || !client || !summary) return { error: "Title, client and summary are required" };
    const data = {
      title,
      slug: slugify(str(fd, "slug") || title),
      client,
      industry: opt(fd, "industry"),
      location: opt(fd, "location"),
      services: fd.getAll("services").map(String).filter(Boolean).join(",") || null,
      summary,
      challenge: opt(fd, "challenge"),
      solution: opt(fd, "solution"),
      results: pairsToJson(fd, "results"),
      content: opt(fd, "content"),
      coverImage: opt(fd, "coverImage"),
      coverAlt: opt(fd, "coverAlt"),
      gallery: linesToJson(fd, "gallery"),
      websiteUrl: opt(fd, "websiteUrl"),
      testimonial: opt(fd, "testimonial"),
      testimonialBy: opt(fd, "testimonialBy"),
      accentColor: opt(fd, "accentColor"),
      seoTitle: opt(fd, "seoTitle"),
      seoDescription: opt(fd, "seoDescription"),
      published: bool(fd, "published"),
      featured: bool(fd, "featured"),
      sortOrder: int(fd, "sortOrder", 0),
      completedAt: date(fd, "completedAt"),
    };
    const p = id ? await prisma.project.update({ where: { id }, data }) : await prisma.project.create({ data });
    revalidateSite();
    redirect(`/admin/projects/${p.id}?saved=1`);
  } catch (e) {
    if ((e as Error & { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: (e as Error).message.includes("Unique") ? "That slug is already in use" : (e as Error).message };
  }
}
export async function deleteProjectAction(fd: FormData) {
  await guard();
  await prisma.project.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/projects");
}

/* ---------------- testimonials ---------------- */
export async function saveTestimonialAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const quote = str(fd, "quote");
  if (!name || !quote) return { error: "Name and quote are required" };
  const data = { name, quote, role: opt(fd, "role"), company: opt(fd, "company"), location: opt(fd, "location"), rating: Math.min(5, Math.max(1, int(fd, "rating", 5))), service: opt(fd, "service"), avatarUrl: opt(fd, "avatarUrl"), published: bool(fd, "published"), featured: bool(fd, "featured"), sortOrder: int(fd, "sortOrder", 0) };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidateSite();
  revalidatePath("/admin/testimonials");
  return { ok: true };
}
export async function deleteTestimonialAction(fd: FormData) {
  await guard();
  await prisma.testimonial.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  revalidatePath("/admin/testimonials");
}

/* ---------------- logos ---------------- */
export async function saveLogoAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return { error: "Name is required" };
  const data = { name, logoUrl: opt(fd, "logoUrl"), website: opt(fd, "website"), published: bool(fd, "published"), sortOrder: int(fd, "sortOrder", 0) };
  if (id) await prisma.clientLogo.update({ where: { id }, data });
  else await prisma.clientLogo.create({ data });
  revalidateSite();
  revalidatePath("/admin/logos");
  return { ok: true };
}
export async function deleteLogoAction(fd: FormData) {
  await guard();
  await prisma.clientLogo.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  revalidatePath("/admin/logos");
}

/* ---------------- faqs ---------------- */
export async function saveFaqAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const id = str(fd, "id");
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (!question || !answer) return { error: "Question and answer are required" };
  const data = { question, answer, category: str(fd, "category") || "general", published: bool(fd, "published"), sortOrder: int(fd, "sortOrder", 0) };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidateSite();
  revalidatePath("/admin/faqs");
  return { ok: true };
}
export async function deleteFaqAction(fd: FormData) {
  await guard();
  await prisma.faq.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  revalidatePath("/admin/faqs");
}

/* ---------------- starter content ---------------- */
export async function seedContentAction(_: ActionState, __: FormData): Promise<ActionState> {
  await guard();
  const created = await seedStarterContent(prisma);
  revalidateSite();
  return created.length ? { ok: true } : { error: "Starter content is already present (tables are not empty), nothing was added." };
}
