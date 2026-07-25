"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SPRING_SNAP } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface TocEntry {
  id: string;
  label: string;
}

/**
 * Sticky table of contents. The active indicator SLIDES between items via a
 * shared layoutId with SPRING_SNAP; under reduced motion it jumps. Collapses
 * to a jump-menu dropdown below 1024px.
 */
export function CaseStudyToc({ entries }: { entries: TocEntry[] }) {
  const { reduced } = useReducedMotionSafe();
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActive(first.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }

    // At the very bottom of the page the last section may never reach the
    // observation band; treat full scroll as "last entry active".
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        const last = entries[entries.length - 1];
        if (last) setActive(last.id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [entries]);

  return (
    <>
      {/* Desktop rail */}
      <nav aria-label="On this page" className="sticky top-24 hidden max-h-[70vh] flex-col gap-0.5 lg:flex">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-fg-subtle">on this page</p>
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              aria-current={isActive ? "true" : undefined}
              className="relative rounded-md px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
            >
              {isActive ? (
                reduced ? (
                  <span className="absolute inset-0 rounded-md bg-bg-subtle" aria-hidden="true" />
                ) : (
                  <motion.span
                    layoutId="toc-indicator"
                    transition={SPRING_SNAP}
                    className="absolute inset-0 rounded-md bg-bg-subtle"
                    aria-hidden="true"
                  />
                )
              ) : null}
              <span className={`relative ${isActive ? "text-accent" : ""}`}>{entry.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Mobile jump menu */}
      <div className="lg:hidden">
        <label className="flex items-center gap-2 font-mono text-xs text-fg-muted">
          jump to
          <select
            value={active}
            onChange={(e) => {
              document.getElementById(e.target.value)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
            }}
            className="h-9 flex-1 rounded-md border border-border bg-bg-elevated px-2 font-mono text-xs text-fg"
          >
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
