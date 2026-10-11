"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribe } from "@/app/actions/public";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const res = await subscribe(fd);
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok) form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full lg:w-[26rem]">
      <input type="hidden" name="source" value={source} />
      <div className="flex gap-2">
        <label htmlFor={`nl-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="field flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-brand-400 focus:shadow-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary shrink-0"
          aria-label="Subscribe"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </>
          )}
        </button>
      </div>
      {msg && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-[0.75rem] ${
            msg.ok ? "text-brand-400" : "text-red-400"
          }`}
        >
          {msg.ok && <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
          {msg.text}
        </p>
      )}
    </form>
  );
}
