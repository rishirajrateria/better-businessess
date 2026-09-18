"use client";
import { useActionState } from "react";
import { seedContentAction, type ActionState } from "@/lib/admin-actions";
import { SubmitButton, Notice } from "@/components/admin/ui";

export function SeedForm() {
  const [state, action] = useActionState<ActionState, FormData>(seedContentAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <p className="text-[14px] text-graphite">Adds sample testimonials, four case studies, three blog articles and two FAQs so the site looks complete on day one. Only fills tables that are empty; edit or delete everything afterwards from the admin.</p>
      <Notice state={state} />
      <SubmitButton variant="outline">Load starter content</SubmitButton>
    </form>
  );
}
