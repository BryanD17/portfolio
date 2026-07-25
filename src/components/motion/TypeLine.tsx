"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { TYPE_CHAR_MS } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Deterministic PRNG so per-character timing varies but never differs between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TypeLineProps {
  text: string;
  /** When false the line waits; flip to true to start typing. */
  start?: boolean;
  /** Seed for the timing variance; keep stable per line. */
  seed?: number;
  onDone?: () => void;
  className?: string;
}

/**
 * Terminal typing with VARIED per-character timing (18 to 34ms, seeded so it
 * is deterministic and cannot cause hydration mismatches). The full string
 * is server-rendered; a layout effect rewinds it before first paint, and the
 * animation writes to the DOM directly so typing never re-renders. Under
 * reduced motion the complete text renders instantly.
 */
export function TypeLine({ text, start = true, seed = 1, onDone, className }: TypeLineProps) {
  const { reduced } = useReducedMotionSafe();
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const doneRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  // Rewind before paint so the server HTML (full text, kept in the document
  // for SEO and no-JS) never flashes.
  useIsomorphicLayoutEffect(() => {
    if (!reduced && !started.current && spanRef.current) {
      spanRef.current.textContent = "";
    }
  }, [reduced]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    if (reduced) {
      el.textContent = text;
      if (start && !started.current) {
        started.current = true;
        doneRef.current?.();
      }
      return;
    }
    if (!start || started.current) return;
    started.current = true;

    const rand = mulberry32(seed * 7919 + text.length);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const nextDelay = () => TYPE_CHAR_MS.min + rand() * (TYPE_CHAR_MS.max - TYPE_CHAR_MS.min);

    const tick = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        doneRef.current?.();
        return;
      }
      timer = setTimeout(tick, nextDelay());
    };
    timer = setTimeout(tick, nextDelay());

    return () => clearTimeout(timer);
  }, [start, reduced, text, seed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={spanRef} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
