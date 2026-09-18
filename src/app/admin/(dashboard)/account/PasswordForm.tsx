"use client";
import { useActionState } from "react";
import { changePasswordAction, type ActionState } from "@/lib/admin-actions";
import { Field, Input, SubmitButton, Notice } from "@/components/admin/ui";

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(changePasswordAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Current password" name="current"><Input name="current" type="password" required autoComplete="current-password" /></Field>
      <Field label="New password (10+ characters)" name="next"><Input name="next" type="password" required minLength={10} autoComplete="new-password" /></Field>
      <Notice state={state} />
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
