"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useIsMobile } from "@/components/motion/useIsMobile";

interface AmbientBackdropProps {
  className?: string;
}

/** Resolve the accent token to an rgb() string canvas gradients can use. */
function resolveAccentRgb(): { r: number; g: number; b: number } {
  const probe = document.createElement("span");
  probe.style.color = "var(--accent)";
  probe.style.display = "none";
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  probe.remove();
  const m = /rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/.exec(rgb);
  if (!m) return { r: 214, g: 160, b: 66 };
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

/**
 * Slow ambient gradient drift on a canvas: two large radial blobs on a ~20s
 * loop, opacity capped at 0.4. Hard requirements honored here:
 * rAF-throttled, paused when off-screen (IntersectionObserver) and when the
 * tab is hidden (visibilitychange), disabled entirely below 768px, replaced
 * by a static gradient under reduced motion, aria-hidden,
 * pointer-events-none, all listeners and rAF handles cleaned up on unmount.
 *
 * Canvas patterns (dpr cap, debounced resize, refs for loop state) after
 * studying react-bits DotField.
 */
export function AmbientBackdrop({ className }: AmbientBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduced } = useReducedMotionSafe();
  const isMobile = useIsMobile();
  const active = !reduced && !isMobile;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf: number | null = null;
    let visible = true;
    let tabVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const { r, g, b } = resolveAccentRgb();

    function doResize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 120);
    }

    function drawBlob(cx: number, cy: number, radius: number, alpha: number) {
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    // ~20s loop driven by wall time so pausing never causes a jump.
    const PERIOD = 20000;
    function frame(now: number) {
      raf = null;
      if (!visible || !tabVisible) return;
      const t = (now % PERIOD) / PERIOD;
      const a = t * Math.PI * 2;
      ctx!.clearRect(0, 0, width, height);
      drawBlob(
        width * (0.3 + 0.08 * Math.sin(a)),
        height * (0.35 + 0.06 * Math.cos(a * 0.7)),
        Math.max(width, height) * 0.45,
        0.09
      );
      drawBlob(
        width * (0.72 + 0.06 * Math.cos(a * 0.9)),
        height * (0.6 + 0.08 * Math.sin(a * 0.6)),
        Math.max(width, height) * 0.38,
        0.07
      );
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (raf === null && visible && tabVisible) raf = requestAnimationFrame(frame);
    }

    function pause() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) play();
        else pause();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    function onVisibility() {
      tabVisible = !document.hidden;
      if (tabVisible) play();
      else pause();
    }

    doResize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
    };
  }, [active]);

  // Below 768px the ambient layer is disabled entirely.
  if (isMobile) return null;

  // Reduced motion: the static gradient IS the composition.
  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(ellipse_50%_40%_at_30%_35%,var(--accent)_0%,transparent_70%)]",
          className
        )}
        style={{ opacity: 0.1 }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 opacity-40", className)}
    />
  );
}
