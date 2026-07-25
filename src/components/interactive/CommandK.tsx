"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PaletteData } from "@/components/interactive/palette-data";

// The palette (cmdk + Dialog) loads ONLY on first Ctrl/Cmd+K or hint click,
// never in the initial chunk.
const CommandPalette = lazy(() =>
  import("@/components/interactive/CommandPalette").then((m) => ({ default: m.CommandPalette }))
);

export function CommandK({ data }: { data: PaletteData }) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLoaded(true);
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        aria-label="Open command palette"
        className="hidden gap-1.5 font-mono text-xs text-fg-muted sm:flex"
      >
        <kbd className="rounded-sm border border-border bg-bg-subtle px-1">Ctrl</kbd>
        <kbd className="rounded-sm border border-border bg-bg-subtle px-1">K</kbd>
      </Button>
      {loaded ? (
        <Suspense fallback={null}>
          <CommandPalette open={open} onOpenChange={setOpen} data={data} />
        </Suspense>
      ) : null}
    </>
  );
}
