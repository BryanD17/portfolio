import { cn } from "@/lib/utils";

interface TagProps {
  tone?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
  children: React.ReactNode;
}

const tones: Record<NonNullable<TagProps["tone"]>, string> = {
  default: "border-border bg-bg-subtle text-fg-muted",
  accent: "border-accent/40 bg-accent/10 text-accent",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export function Tag({ tone = "default", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-xs",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
