"use client";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/admin-actions";
import { Field, Input, SubmitButton, Notice } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <Field label="Email" name="email"><Input key={state?.email ?? ""} name="email" type="email" autoComplete="username" required defaultValue={state?.email ?? ""} /></Field>
      <Field label="Password" name="password"><Input name="password" type="password" autoComplete="current-password" required /></Field>
      <Notice state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
