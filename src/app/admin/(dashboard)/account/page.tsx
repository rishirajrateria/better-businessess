import { getSession } from "@/lib/auth";
import { Card } from "@/components/admin/Charts";
import { PasswordForm } from "./PasswordForm";
import { site } from "@/lib/site";

export default async function AccountPage() {
  const s = await getSession();
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Account</h1><p className="text-[14px] text-slate">Signed in as {s?.email}</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Change password"><PasswordForm /></Card>
        <Card title="Setup checklist">
          <ul className="space-y-2 text-[14px] text-graphite">
            <li>• Update NAP details (name, address, phone) in <code className="rounded bg-cream px-1">src/lib/site.ts</code></li>
            <li>• Set <code className="rounded bg-cream px-1">NEXT_PUBLIC_SITE_URL</code> to {site.url}</li>
            <li>• Add <code className="rounded bg-cream px-1">RESEND_API_KEY</code> for lead email alerts</li>
            <li>• Verify the site in Google Search Console and submit <code className="rounded bg-cream px-1">/sitemap.xml</code></li>
            <li>• Create a Google Business Profile with identical NAP</li>
            <li>• Add client logos, testimonials and at least 3 projects</li>
            <li>• Publish 2 blog posts per month for compounding SEO</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
