/**
 * Read-side helpers for CMS content. Every function fails soft so the marketing
 * site still renders (with sensible fallbacks) if the database is unreachable.
 */
import { prisma } from "./db";
import type { Faq } from "./services";

const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("[queries] falling back:", (e as Error).message);
    return fallback;
  }
};

export const getPublishedPosts = (opts: { limit?: number; category?: string; tag?: string; q?: string } = {}) =>
  safe(
    () =>
      prisma.post.findMany({
        where: {
          published: true,
          ...(opts.category ? { category: opts.category } : {}),
          ...(opts.tag ? { tags: { contains: opts.tag } } : {}),
          ...(opts.q ? { OR: [{ title: { contains: opts.q } }, { excerpt: { contains: opts.q } }, { content: { contains: opts.q } }] } : {}),
        },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: opts.limit,
      }),
    [],
  );

export const getPostBySlug = (slug: string) => safe(() => prisma.post.findFirst({ where: { slug, published: true } }), null);

export const getPostCategories = () =>
  safe(async () => {
    const rows = await prisma.post.findMany({ where: { published: true, category: { not: null } }, select: { category: true }, distinct: ["category"] });
    return rows.map((r) => r.category!).filter(Boolean).sort();
  }, []);

export const getPublishedProjects = (opts: { limit?: number; featured?: boolean; service?: string } = {}) =>
  safe(
    () =>
      prisma.project.findMany({
        where: { published: true, ...(opts.featured ? { featured: true } : {}), ...(opts.service ? { services: { contains: opts.service } } : {}) },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { completedAt: "desc" }],
        take: opts.limit,
      }),
    [],
  );

export const getProjectBySlug = (slug: string) => safe(() => prisma.project.findFirst({ where: { slug, published: true } }), null);

export const getTestimonials = (opts: { limit?: number; service?: string } = {}) =>
  safe(
    () =>
      prisma.testimonial.findMany({
        where: { published: true, ...(opts.service ? { OR: [{ service: opts.service }, { service: null }] } : {}) },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        take: opts.limit,
      }),
    [],
  );

export const getClientLogos = () => safe(() => prisma.clientLogo.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }), []);

export const getFaqs = (category = "general"): Promise<Faq[]> =>
  safe(async () => {
    const rows = await prisma.faq.findMany({ where: { published: true, category }, orderBy: { sortOrder: "asc" } });
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  }, []);

export const parseJson = <T,>(s: string | null | undefined, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

export const splitList = (s: string | null | undefined) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : []);
