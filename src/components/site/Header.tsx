"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { coreServices, subServices } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services", mega: true },
  { href: "/locations", label: "Locations" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "pt-3" : "pt-5")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={cn("flex h-16 items-center justify-between rounded-full px-4 pl-5 transition-all duration-500 sm:px-5", scrolled || open ? "glass glass-solid" : "bg-transparent")}>
          <Logo size="sm" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) =>
              item.mega ? (
                <div key={item.href} className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
                  <Link href={item.href} className={cn("flex items-center gap-1 rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors hover:text-gold-deep", pathname.startsWith("/services") && "text-gold-deep")} aria-expanded={mega} aria-haspopup="true">
                    {item.label} <ChevronDown size={14} className={cn("transition-transform", mega && "rotate-180")} />
                  </Link>
                  <div className={cn("absolute left-1/2 top-full pt-4 -translate-x-1/2 transition-all duration-300", mega ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2")}>
                    <div className="glass glass-solid w-[760px] rounded-3xl p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Core services</p>
                          {coreServices.map((s) => (
                            <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-gold-pale/70">
                              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-pale text-gold-deep ring-1 ring-gold/20 group-hover:bg-white">
                                <ServiceIcon icon={s.icon} size={18} />
                              </span>
                              <span>
                                <span className="block font-display text-[15px] font-semibold tracking-tight text-ink">{s.name}</span>
                                <span className="block text-[13px] leading-5 text-slate">{s.tagline}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div>
                          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Specialties</p>
                          <div className="grid grid-cols-2 gap-1">
                            {subServices.map((s) => (
                              <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium text-graphite transition-colors hover:bg-gold-pale/70 hover:text-ink">
                                <ServiceIcon icon={s.icon} size={15} className="text-gold-deep" /> {s.shortName}
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 rounded-2xl bg-ink p-4 text-paper">
                            <p className="text-[13px] text-paper/70">Not sure where to start?</p>
                            <Link href="/contact" className="mt-1 inline-flex items-center gap-1 font-display text-[15px] font-semibold text-gold-light hover:text-gold">
                              Get a free growth audit <ArrowUpRight size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={cn("rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors hover:text-gold-deep", pathname.startsWith(item.href) && "text-gold-deep")}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {site.phone && (
              <a href={site.phoneHref} className="px-3 text-[14px] font-medium text-graphite hover:text-gold-deep" data-track="phone_click">
                {site.phone}
              </a>
            )}
            <Button href="/contact" size="sm" track="cta_header">
              Get a proposal
            </Button>
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={cn("lg:hidden fixed inset-x-0 top-[5.5rem] bottom-0 z-40 transition-all duration-400", open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none")}>
        <div className="mx-4 h-[calc(100%-1rem)] overflow-y-auto rounded-3xl glass glass-solid p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Services</p>
          <div className="mt-2 grid gap-1">
            {coreServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-3 font-display text-[16px] font-semibold text-ink hover:bg-gold-pale/70">
                <ServiceIcon icon={s.icon} size={18} className="text-gold-deep" /> {s.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-1 px-1 pt-1">
              {subServices.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-lg px-2 py-2 text-[13.5px] text-graphite hover:text-ink">
                  {s.shortName}
                </Link>
              ))}
            </div>
          </div>
          <div className="my-5 hairline" />
          <div className="grid gap-1">
            {nav.filter((n) => !n.mega).map((n) => (
              <Link key={n.href} href={n.href} className="rounded-xl px-3 py-3 font-display text-[16px] font-semibold text-ink hover:bg-gold-pale/70">
                {n.label}
              </Link>
            ))}
            <Link href="/contact" className="rounded-xl px-3 py-3 font-display text-[16px] font-semibold text-ink hover:bg-gold-pale/70">
              Contact
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/contact" track="cta_mobile_menu">Get a free proposal</Button>
            {site.phone && (
              <Button href={site.phoneHref} variant="outline" track="phone_click">
                Call {site.phone}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
