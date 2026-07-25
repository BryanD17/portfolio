"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the button simply does nothing visible
    }
  }

  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="flex items-center gap-1 rounded-sm p-1 font-mono text-xs text-fg-subtle transition-colors hover:text-fg"
    >
      {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
      {copied ? "copied" : "copy"}
    </button>
  );
}
