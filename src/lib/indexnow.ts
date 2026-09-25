import { createHash } from "node:crypto";
import { site } from "./site";

/**
 * IndexNow (Bing, Yandex, Naver, Seznam) — Bing's index feeds ChatGPT search and Copilot, so
 * pushing URL changes here gets new content in front of AI assistants within minutes instead of
 * waiting for a crawl. The key is public by design; it only proves the ping came from this host.
 * Override with INDEXNOW_KEY, otherwise a stable key is derived from the domain (zero config).
 */
export const indexNowKey = (process.env.INDEXNOW_KEY || createHash("sha256").update(`${site.domain}:indexnow`).digest("hex").slice(0, 32)).replace(/[^a-zA-Z0-9-]/g, "");
export const indexNowKeyPath = "/indexnow-key.txt";

export async function pingIndexNow(paths: string[]) {
  const urlList = [...new Set(paths)].map((p) => `${site.url}${p}`);
  if (!urlList.length || process.env.NODE_ENV !== "production" || process.env.INDEXNOW_DISABLED === "1") return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(site.url).host, key: indexNowKey, keyLocation: `${site.url}${indexNowKeyPath}`, urlList: urlList.slice(0, 10000) }),
    });
  } catch {
    // Best effort: indexing pings must never break a save.
  }
}
