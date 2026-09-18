/** Tiny, dependency-free user-agent classifier for first-party analytics. */
export function parseUA(ua: string) {
  const s = ua || "";
  const isBot = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|gptbot|claudebot|perplexity|bingpreview|python-requests|curl\//i.test(s);
  const device = /ipad|tablet|kindle|silk|playbook/i.test(s) ? "tablet" : /mobi|iphone|android.*mobile|windows phone/i.test(s) ? "mobile" : "desktop";
  let browser = "Other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/chrome|crios/i.test(s)) browser = "Chrome";
  else if (/firefox|fxios/i.test(s)) browser = "Firefox";
  else if (/safari/i.test(s)) browser = "Safari";
  else if (/samsungbrowser/i.test(s)) browser = "Samsung Internet";
  let os = "Other";
  if (/windows/i.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/android/i.test(s)) os = "Android";
  else if (/linux/i.test(s)) os = "Linux";
  else if (/cros/i.test(s)) os = "ChromeOS";
  return { isBot, device, browser, os };
}
