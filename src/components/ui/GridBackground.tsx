import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

/**
 * Static grid layer. Pure composition, not motion: it renders identically
 * under prefers-reduced-motion. Always aria-hidden and pointer transparent.
 */
export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]",
        "bg-[size:56px_56px]",
        "opacity-30",
        "[mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_30%,transparent_100%)]",
        className
      )}
    />
  );
}
