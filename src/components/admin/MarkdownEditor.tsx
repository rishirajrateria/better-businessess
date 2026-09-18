"use client";
import { useState } from "react";
import { marked } from "marked";
import { inputCls } from "./ui";
import { cn } from "@/lib/utils";

export function MarkdownEditor({ name, defaultValue = "", rows = 18, label = "Content (Markdown)", required }: { name: string; defaultValue?: string; rows?: number; label?: string; required?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[12.5px] font-semibold text-graphite" htmlFor={name}>{label}</label>
        <div className="flex rounded-full border border-ink/10 p-0.5 text-[12px] font-semibold">
          <button type="button" onClick={() => setPreview(false)} className={cn("rounded-full px-3 py-1", !preview ? "bg-ink text-paper" : "text-graphite")}>Write</button>
          <button type="button" onClick={() => setPreview(true)} className={cn("rounded-full px-3 py-1", preview ? "bg-ink text-paper" : "text-graphite")}>Preview</button>
        </div>
      </div>
      {preview ? (
        <div className="prose-bb min-h-[200px] rounded-xl border border-ink/10 bg-white p-5" dangerouslySetInnerHTML={{ __html: marked.parse(value) as string }} />
      ) : (
        <textarea id={name} name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={rows} required={required} className={cn(inputCls, "resize-y font-mono text-[13px] leading-6")} placeholder={"## Heading\n\nWrite in Markdown. **Bold**, _italic_, [links](https://), lists, images ![alt](url)…"} />
      )}
      {preview && <textarea name={name} value={value} readOnly hidden aria-hidden />}
      <p className="mt-1 text-[12px] text-slate">{value.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.round(value.split(/\s+/).length / 220))} min read</p>
    </div>
  );
}
