"use client";
import { useActionState } from "react";
import { updateLeadAction, deleteLeadAction, type ActionState } from "@/lib/admin-actions";
import { Field, Select, Textarea, SubmitButton, Notice, DeleteButton } from "@/components/admin/ui";
import type { Lead } from "@/prisma-types";

export function LeadForm({ lead }: { lead: Lead }) {
  const [state, action] = useActionState<ActionState, FormData>(updateLeadAction, undefined);
  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={lead.id} />
        <Field label="Status" name="status"><Select name="status" defaultValue={lead.status}>{["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="Internal notes" name="notes"><Textarea name="notes" rows={6} defaultValue={lead.notes ?? ""} className="!font-sans !text-[14px]" placeholder="Call notes, next steps…" /></Field>
        <Notice state={state} />
        <SubmitButton className="w-full">Save</SubmitButton>
        <div className="flex justify-end"><DeleteButton action={deleteLeadAction} id={lead.id} label="Delete lead" confirmText="Delete this lead permanently?" /></div>
      </form>
      <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your enquiry to Better Businesses`)}`} className="block rounded-full bg-gold-gradient px-4 py-2.5 text-center text-[14px] font-semibold text-ink">Reply by email</a>
    </div>
  );
}
