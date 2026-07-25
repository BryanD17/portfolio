"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function isLight() {
  return document.documentElement.classList.contains("light");
}

/**
 * Dark (default) to light class swap on <html>, persisted to localStorage.
 * The inline script in the layout head applies the stored theme BEFORE
 * first paint, so there is never a flash of the wrong theme.
 */
export function ThemeToggle() {
  const light = useSyncExternalStore(subscribe, isLight, () => false);

  const toggle = useCallback(() => {
    const next = !isLight();
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // private mode; theme just will not persist
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={light}
    >
      {light ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
    </Button>
  );
}
