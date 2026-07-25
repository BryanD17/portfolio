import { cn } from "@/lib/utils";

interface TerminalProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Terminal({ title = "bryan@portfolio", className, children }: TerminalProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-bg-subtle px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 rounded-lg bg-danger/70" />
        <span aria-hidden="true" className="size-2.5 rounded-lg bg-warning/70" />
        <span aria-hidden="true" className="size-2.5 rounded-lg bg-success/70" />
        <span className="ml-2 font-mono text-xs text-fg-subtle">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed sm:p-5">{children}</div>
    </div>
  );
}
