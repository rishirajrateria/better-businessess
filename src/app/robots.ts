import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Explicitly welcome search engines AND AI crawlers so the business can be
 * discovered, indexed and cited by Google, Bing, ChatGPT, Claude, Gemini,
 * Perplexity and future models. Admin and API routes are excluded.
 */
const aiBots = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "anthropic-ai", "Google-Extended", "Gemini", "PerplexityBot", "Perplexity-User", "Applebot", "Applebot-Extended", "Bytespider", "CCBot", "cohere-ai", "meta-externalagent", "Amazonbot", "DuckAssistBot", "YouBot", "MistralAI-User"];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/admin/", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
