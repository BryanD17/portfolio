import { cn } from "@/lib/utils";

interface PromptProps {
  user?: string;
  host?: string;
  path?: string;
  className?: string;
}

export function Prompt({ user = "bryan", host = "portfolio", path = "~", className }: PromptProps) {
  return (
    <span className={cn("font-mono", className)}>
      <span className="text-success">
        {user}@{host}
      </span>
      <span className="text-fg-subtle">:</span>
      <span className="text-accent">{path}</span>
      <span className="text-fg-subtle">$</span>{" "}
    </span>
  );
}
