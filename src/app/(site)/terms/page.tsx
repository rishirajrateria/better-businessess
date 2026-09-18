import type { Metadata } from "next";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({ title: "Terms of Service", description: `Terms governing use of the ${site.name} website and services.`, path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHero compact eyebrow="Legal" breadcrumbs={<Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }]} />} title="Terms of Service" subtitle={`Last updated ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long" })}.`} />
      <Container size="narrow" className="prose-bb pb-24">
        <h2>Use of this website</h2>
        <p>This website is operated by {site.legalName}. By using it you agree to these terms. Content is provided for general information and does not constitute professional advice.</p>
        <h2>Intellectual property</h2>
        <p>All content, design and code on this website are the property of {site.legalName} or its licensors and may not be reproduced without permission.</p>
        <h2>Services</h2>
        <p>Services are governed by the written agreement or statement of work signed with each client. Performance figures on this website are illustrative of past results and are not guarantees of future outcomes.</p>
        <h2>Limitation of liability</h2>
        <p>To the fullest extent permitted by law, {site.legalName} is not liable for indirect or consequential damages arising from use of this website.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the Province of {site.hq.province} and the federal laws of Canada applicable therein.</p>
        <h2>Contact</h2>
        <p>{site.email}</p>
      </Container>
    </>
  );
}
