import { Button, ArrowIcon } from "@/components/ui/Button";
import { Orbs } from "@/components/site/Visuals";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main" className="pt-24">
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <Orbs />
      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <p className="font-display text-7xl font-semibold text-gold-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">This page moved, or never existed.</h1>
        <p className="mt-4 text-lg text-slate">Let&apos;s get you back to something useful.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back home <ArrowIcon /></Button>
          <Button href="/services" variant="outline">Browse services</Button>
          <Button href="/contact" variant="glass">Contact us</Button>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
