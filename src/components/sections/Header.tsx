"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const NAV = [
  { label: "projects", href: "/#projects" },
  { label: "experience", href: "/#experience" },
  { label: "skills", href: "/#skills" },
  { label: "contact", href: "/#contact" },
];

interface HeaderProps {
  githubUrl: string;
  linkedinUrl: string;
  /** Slots filled by Agent 13. */
  themeToggle?: React.ReactNode;
  commandHint?: React.ReactNode;
}

/**
 * Sticky header whose background blur and border fade in progressively over
 * the first ~120px of scroll, bound to scroll position rather than toggled
 * at a threshold. Collapses to a sheet below 768px.
 */
export function Header({ githubUrl, linkedinUrl, themeToggle, commandHint }: HeaderProps) {
  const { reduced } = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const backdropOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  // Scroll-spy: highlight the nav item for the section in view (home only).
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["projects", "experience", "skills", "contact"];
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActiveSection(first.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 border-b border-border bg-bg/85 backdrop-blur-md"
        style={{ opacity: reduced ? 1 : backdropOpacity }}
      />
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" className="touch-target font-mono text-sm font-semibold text-fg">
          <span className="text-accent">~/</span>bryan-joseph
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => {
            const isActive =
              pathname === "/" && activeSection !== "" && item.href === `/#${activeSection}`;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={
                  isActive
                    ? "font-mono text-xs text-accent"
                    : "font-mono text-xs text-fg-muted transition-colors hover:text-fg"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {commandHint}
          {themeToggle}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="touch-target p-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="touch-target p-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            <LinkedinIcon className="size-4" />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="font-mono text-sm">
                  <span className="text-accent">~/</span>bryan-joseph
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 font-mono text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
