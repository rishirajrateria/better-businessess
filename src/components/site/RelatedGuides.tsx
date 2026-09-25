import { PostCard } from "./Cards";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import type { Guide } from "@/lib/related-guides";

/** Three hand-picked guides for the current service / location, linking the programmatic pages into the blog. */
export function RelatedGuides({ guides, title, subtitle }: { guides: Guide[]; title: React.ReactNode; subtitle?: string }) {
  if (!guides.length) return null;
  return (
    <Section tone="cream" size="sm">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
        <SectionHeader eyebrow="Guides" title={title} subtitle={subtitle} align="left" className="mb-0" />
        <Button href="/industries" variant="outline">All industry guides <ArrowIcon /></Button>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {guides.map((g, i) => (
          <div key={g.slug} data-reveal data-reveal-delay={i * 90}><PostCard p={g} /></div>
        ))}
      </div>
    </Section>
  );
}
