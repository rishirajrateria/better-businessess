"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { site } from "@/lib/site";

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
    const onAdmin = () => window.location.pathname.startsWith("/admin");
    /** Where on the page an element sits, for the admin "Calls" report. */
    const where = (node: Element | null): string => {
      if (!node) return "Page content";
      if (node.closest('[data-track="phone_click_floating"]')) return "Floating call button";
      if (node.closest("header")) return "Header";
      if (node.closest("footer")) return "Footer";
      if (window.location.pathname === "/contact") return "Contact page";
      if (node.closest("form, [data-contact-form]")) return "Contact form";
      return "Page content";
    };
    const phoneDigits = site.phone.replace(/\D/g, "").slice(-10);

    const onClick = (e: MouseEvent) => {
      if (onAdmin()) return;
      const target = e.target as HTMLElement | null;
      // Every click on a tel: link (the number or any Call button) is a call click, whether or not it carries a data-track.
      const tel = target?.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (tel) {
        track("phone_click", { location: where(tel), text: tel.textContent?.trim().slice(0, 60) });
        return;
      }
      const el = target?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) track(el.dataset.track, { href: (el as HTMLAnchorElement).href ?? undefined, text: el.textContent?.trim().slice(0, 60) });
    };
    // Copying the number: select + copy (Ctrl/Cmd+C or the mobile "Copy" bubble).
    const onCopy = () => {
      if (onAdmin() || !phoneDigits) return;
      const sel = window.getSelection();
      const text = sel?.toString() ?? "";
      if (!text || text.length > 80) return; // ignore select-all copies of whole pages
      if (!text.replace(/\D/g, "").includes(phoneDigits)) return;
      const anchor = sel?.anchorNode;
      track("phone_copy", { method: "copy", location: where(anchor instanceof Element ? anchor : (anchor?.parentElement ?? null)) });
    };
    // Right-click / long-press on the number opens the browser menu (Copy, Save contact...). Counted as copy intent.
    const onMenu = (e: MouseEvent) => {
      if (onAdmin()) return;
      const tel = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (tel) track("phone_copy", { method: "menu", location: where(tel) });
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onMenu, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("contextmenu", onMenu, { capture: true });
    };
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
    </>
  );
}
