"use client";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputCls = "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15 placeholder:text-mist disabled:bg-cream";
export const labelCls = "mb-1.5 block text-[12.5px] font-semibold text-graphite";

export function Field({ label, name, hint, children, className }: { label: string; name?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelCls} htmlFor={name}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-slate">{hint}</p>}
    </div>
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} id={props.id ?? props.name} className={cn(inputCls, props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} id={props.id ?? props.name} className={cn(inputCls, "min-h-[90px] resize-y font-mono text-[13px] leading-6", props.className)} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} id={props.id ?? props.name} className={cn(inputCls, props.className)} />;
}
export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-graphite">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-ink/20 accent-gold" /> {label}
    </label>
  );
}
export function SubmitButton({ children, className, variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "gold" | "outline" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold transition disabled:opacity-60", variant === "primary" && "bg-ink text-paper hover:bg-ink-soft", variant === "gold" && "bg-gold-gradient text-ink", variant === "outline" && "border border-ink/15 text-ink hover:border-gold", className)}>
      {pending && <Loader2 size={15} className="animate-spin" />} {children}
    </button>
  );
}
/**
 * Delete button that lives INSIDE an edit form. It uses the button's own
 * formAction so it triggers the delete server action without nesting forms
 * (nested <form> elements are invalid HTML and break hydration).
 */
export function DeleteButton({ action, id, label = "Delete", confirmText = "Delete this item permanently?" }: { action: (fd: FormData) => void | Promise<void>; id: string; label?: string; confirmText?: string }) {
  return (
    <button
      type="submit"
      formAction={action}
      formNoValidate
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      data-id={id}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-3.5 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
    >
      <Trash2 size={14} /> {label}
    </button>
  );
}
export function Notice({ state }: { state?: { ok?: boolean; error?: string } }) {
  if (!state) return null;
  if (state.error) return <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13.5px] text-red-700" role="alert">{state.error}</p>;
  if (state.ok) return <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13.5px] text-emerald-700" role="status">Saved.</p>;
  return null;
}
