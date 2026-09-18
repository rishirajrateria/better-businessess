"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function getId(key: string, storage: Storage) {
  try {
    let v = storage.getItem(key);
    if (!v) {
      v = uid();
      storage.setItem(key, v);
    }
    return v;
  } catch {
    return uid();
  }
}

export function track(name: string, meta?: Record<string, unknown>) {
  try {
    const body = JSON.stringify({ name, path: window.location.pathname, sessionId: getId("bb_sid", sessionStorage), meta });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/event", new Blob([body], { type: "application/json" }));
    else fetch("/api/track/event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    // Forward to GA4 if present
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, meta ?? {});
  } catch {}
}

/** First-party page-view tracker + delegated CTA click tracking. Skips /admin. */
export function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();
  const last = useRef<string>("");
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const key = pathname + "?" + search.toString();
    if (last.current === key) return;
    last.current = key;
    const payload = {
      path: pathname,
      referrer: document.referrer || null,
      sessionId: getId("bb_sid", sessionStorage),
      visitorId: getId("bb_vid", localStorage),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      utmSource: search.get("utm_source"),
      utmMedium: search.get("utm_medium"),
      utmCampaign: search.get("utm_campaign"),
    };
    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    } catch {}
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) track(el.dataset.track, { href: (el as HTMLAnchorElement).href ?? undefined, text: el.textContent?.trim().slice(0, 60) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
    </>
  );
}
