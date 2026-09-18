import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Render trusted (admin-authored) Markdown to HTML with heading ids for anchor links. */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }) => {
    const id = text.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  renderer.image = ({ href, title, text }) => `<img src="${href}" alt="${text ?? ""}" ${title ? `title="${title}"` : ""} loading="lazy" />`;
  return marked.parse(md, { renderer }) as string;
}

export function extractHeadings(md: string): { id: string; text: string; depth: number }[] {
  const out: { id: string; text: string; depth: number }[] = [];
  for (const line of md.split("\n")) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      out.push({ depth: m[1].length, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") });
    }
  }
  return out;
}

export const readingTime = (md: string) => Math.max(1, Math.round(md.split(/\s+/).length / 220));

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);

export function excerptFrom(md: string, len = 160) {
  const txt = md.replace(/[#*_`>\[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  return txt.length > len ? `${txt.slice(0, len - 1).trim()}…` : txt;
}
