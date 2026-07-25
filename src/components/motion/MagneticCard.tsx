"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SPRING_SNAP } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

function subscribeHover(callback: () => void) {
  const mql = window.matchMedia("(hover: hover)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** True only on devices with a real hover pointer. Server snapshot false. */
function useCanHover(): boolean {
  return useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia("(hover: hover)").matches,
    () => false
  );
}

interface MagneticCardProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Proximity hover: a radial glow follows the cursor inside the card via CSS
 * custom properties updated on a rAF-throttled pointermove, the border
 * brightens toward the accent, and the card lifts 2px with SPRING_SNAP.
 * Disabled on touch devices and under reduced motion, where hover is a
 * border color change only (handled by the hover: utility styles below).
 *
 * Glow-follow technique (custom properties + masked overlay) after studying
 * magicui border-beam and card composition in shadcn-ui.
 */
export function MagneticCard({ className, children }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const { reduced } = useReducedMotionSafe();
  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);

  const interactive = canHover && !reduced;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || rafRef.current !== null) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }

  function onLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={() => interactive && setHovered(true)}
      onPointerLeave={onLeave}
      animate={interactive ? { y: hovered ? -2 : 0 } : undefined}
      transition={SPRING_SNAP}
      className={cn(
        "group/magnetic relative rounded-lg border border-border bg-bg-elevated",
        "transition-colors hover:border-accent/60",
        className
      )}
    >
      {interactive ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)",
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
