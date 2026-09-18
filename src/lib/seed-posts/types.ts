export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  readingMinutes: number;
  publishedAt: string; // ISO date
  featured?: boolean;
  seoTitle?: string;
  seoDescription: string;
  faqs?: { question: string; answer: string }[];
  content: string; // Markdown
};
