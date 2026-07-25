"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copy-to-clipboard for the email with a confirmation announced politely. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the mailto link right next to this still works
    }
  }

  return (
    <button
      onClick={copy}
      aria-label={copied ? "Email copied" : `Copy ${email} to clipboard`}
      className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
    >
      {copied ? (
        <Check className="size-3 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
      {copied ? "copied" : "copy"}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
