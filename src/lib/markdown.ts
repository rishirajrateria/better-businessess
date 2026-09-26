import { marked } from "marked";
import { site } from "./site";

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
  const html = marked.parse(md, { renderer }) as string;
  // Cited sources open in a new tab; they stay followed links because they point at authoritative publishers.
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) => (href.startsWith(site.url) ? m : `<a href="${href}" target="_blank" rel="noopener"`));
}

/** Parse the "## Sources" list at the end of an article into citation entries (for BlogPosting.citation). */
export function extractSources(md: string): { name: string; url: string; publisher?: string }[] {
  const m = /^##\s+Sources\s*$/m.exec(md);
  if (!m) return [];
  const section = md.slice(m.index + m[0].length).split(/^##\s+/m)[0];
  const out: { name: string; url: string; publisher?: string }[] = [];
  for (const line of section.split("\n")) {
    const l = /^\s*(?:[-*]|\d+\.)\s+\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)(?:\s*[—–-]\s*(.+))?/.exec(line);
    if (l) out.push({ name: l[1], url: l[2], ...(l[3] ? { publisher: l[3].trim() } : {}) });
  }
  return out;
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
