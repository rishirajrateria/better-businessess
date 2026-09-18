import Link from "next/link";
import { ProjectForm } from "@/components/admin/Forms";

export default function NewProject() {
  return (
    <div className="space-y-6">
      <Link href="/admin/projects" className="text-[13px] font-semibold text-slate hover:text-ink">← All projects</Link>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">New project</h1>
      <ProjectForm />
    </div>
  );
}
