import type { Metadata } from "next";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", description: `How ${site.name} collects, uses and protects personal information under PIPEDA and Canadian privacy law.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero compact eyebrow="Legal" breadcrumbs={<Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]} />} title="Privacy Policy" subtitle={`Last updated ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long" })}.`} />
      <Container size="narrow" className="prose-bb pb-24">
        <p>{site.legalName} (&quot;{site.name}&quot;, &quot;we&quot;) is committed to protecting personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation.</p>
        <h2>Information we collect</h2>
        <p>When you contact us we collect the information you provide, such as your name, email address, phone number, company and message. Our website also collects limited, first-party analytics data (pages viewed, referring site, device type, approximate region) to understand how the site is used. We do not sell personal information.</p>
        <h2>How we use information</h2>
        <ul>
          <li>To respond to enquiries and provide proposals and services</li>
          <li>To improve our website and marketing</li>
          <li>To send communications you have consented to receive, in compliance with Canada&apos;s Anti-Spam Legislation (CASL)</li>
        </ul>
        <h2>Cookies and analytics</h2>
        <p>We use essential cookies and privacy-respecting first-party analytics. Where Google Analytics is enabled, IP addresses are anonymized. You can disable cookies in your browser at any time.</p>
        <h2>Retention and security</h2>
        <p>We retain personal information only as long as necessary for the purposes described and protect it with appropriate technical and organizational safeguards.</p>
        <h2>Your rights</h2>
        <p>You may request access to, correction of, or deletion of your personal information by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <h2>Contact</h2>
        <p>{site.legalName}, {site.hq.city}, {site.hq.province}, Canada · {site.email}</p>
      </Container>
    </>
  );
}
