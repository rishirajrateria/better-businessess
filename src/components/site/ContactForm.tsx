"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { track } from "./Analytics";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-[15px] text-ink placeholder:text-mist outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";
const label = "mb-1.5 block text-[13px] font-semibold text-graphite";

/**
 * Short call-back form: name, phone and company only. The page's service and city are sent as
 * hidden context so each lead still shows where it came from in the admin.
 */
export function ContactForm({ defaultService, defaultCity, dark, heading }: { defaultService?: string; defaultCity?: string; compact?: boolean; dark?: boolean; heading?: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [started, setStarted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: pathname, referrer: document.referrer || null, utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign") }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
      track("form_submit", { service: data.service });
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={cn("rounded-glass p-8 text-center", dark ? "glass-dark text-paper" : "glass")} role="status">
        <CheckCircle2 size={44} className="mx-auto text-gold" />
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">Thank you. We&apos;ll call you shortly.</h3>
        <p className={cn("mt-2 text-[15px] leading-7", dark ? "text-paper/70" : "text-slate")}>
          A strategist will call you within one business day.{site.phone ? <> Prefer not to wait? Call us at <a href={site.phoneHref} className="font-semibold underline" data-track="phone_click">{site.phone}</a>.</> : null}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("rounded-glass p-6 md:p-8", dark ? "glass-dark text-paper" : "glass glass-strong")} onFocus={() => { if (!started) { setStarted(true); track("form_start"); } }} noValidate>
      {heading && <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">{heading}</h2>}
      {/* honeypot */}
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {defaultService && <input type="hidden" name="service" value={defaultService} />}
      {defaultCity && <input type="hidden" name="city" value={defaultCity} />}
      <div className="grid gap-4">
        <div>
          <label className={cn(label, dark && "text-paper/80")} htmlFor="name">Your name *</label>
          <input id="name" name="name" required className={input} placeholder="Jordan Lee" autoComplete="name" />
        </div>
        <div>
          <label className={cn(label, dark && "text-paper/80")} htmlFor="phone">Phone number *</label>
          <input id="phone" name="phone" type="tel" required inputMode="tel" className={input} placeholder="(416) 555-0123" autoComplete="tel" />
        </div>
        <div>
          <label className={cn(label, dark && "text-paper/80")} htmlFor="company">Company name</label>
          <input id="company" name="company" className={input} placeholder="Your business" autoComplete="organization" />
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
      <div className="mt-6 flex flex-col items-start gap-3">
        <Button type="submit" variant={dark ? "gold" : "primary"} size="lg" disabled={state === "loading"} className="w-full">
          {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : <Phone size={17} />}
          {state === "loading" ? "Sending…" : "Request a free call back"} {state !== "loading" && <ArrowIcon />}
        </Button>
        <p className={cn("text-[12.5px]", dark ? "text-paper/50" : "text-slate")}>We call back within one business day. No spam, ever.</p>
      </div>
    </form>
  );
}
