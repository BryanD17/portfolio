import { cn } from "@/lib/utils";

interface CursorProps {
  blink?: boolean;
  className?: string;
}

export function Cursor({ blink = true, className }: CursorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-accent",
        blink && "cursor-blink",
        className
      )}
    />
  );
}
