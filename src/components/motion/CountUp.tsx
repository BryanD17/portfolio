"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/** Avoids the SSR useLayoutEffect warning while still rewinding before paint. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { animate, useInView } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface CountUpProps {
  to: number;
  /** Decimal places to keep during and after the count (3.85 needs 2). */
  decimals?: number;
  /** Seconds. */
  duration?: number;
  /** Seconds before starting once triggered. */
  delay?: number;
  /** Fire when scrolled into view (default) or immediately when true is passed via start. */
  startOnView?: boolean;
  /** External trigger when startOnView is false. */
  start?: boolean;
  className?: string;
}

function format(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Counts from 0 to the target with thousands separators applied DURING the
 * count. The final value is server-rendered so the number exists without
 * JavaScript and for crawlers; the animation rewinds to 0 before first paint
 * and plays. Under reduced motion the final value renders immediately.
 *
 * Technique after studying react-bits CountUp: drive textContent from an
 * animation callback rather than React state so the count never re-renders.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.2,
  delay = 0,
  startOnView = true,
  start = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useReducedMotionSafe();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const played = useRef(false);

  const shouldStart = startOnView ? inView : start;

  // Rewind to 0 before first paint so the server-rendered final value never
  // flashes ahead of the count.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced || played.current || shouldStart) return;
    el.textContent = format(0, decimals);
  }, [shouldStart, reduced, decimals]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      // Covers flipping reduced motion on mid-animation: settle at the final
      // value rather than freezing at a partial count.
      el.textContent = format(to, decimals);
      return;
    }
    if (played.current || !shouldStart) return;
    played.current = true;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        el.textContent = format(latest, decimals);
      },
      onComplete: () => {
        el.textContent = format(to, decimals);
      },
    });
    return () => controls.stop();
  }, [shouldStart, to, decimals, duration, delay, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(to, decimals)}
    </span>
  );
}
