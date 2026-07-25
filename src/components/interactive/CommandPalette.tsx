"use client";

import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { PaletteData } from "@/components/interactive/palette-data";

const SECTIONS = [
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PaletteData;
}

export function CommandPalette({ open, onOpenChange, data }: CommandPaletteProps) {
  const router = useRouter();

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette" description="Search sections, projects, and actions">
      <Command>
        <CommandInput placeholder="Search sections, projects, actions..." />
        <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Sections">
          {SECTIONS.map((s) => (
            <CommandItem key={s.href} onSelect={() => run(() => router.push(s.href))}>
              {s.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Case studies">
          {data.caseStudies.map((c) => (
            <CommandItem key={c.slug} onSelect={() => run(() => router.push(`/projects/${c.slug}`))}>
              {c.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Repositories">
          {data.repos.map((r) => (
            <CommandItem key={r.name} onSelect={() => run(() => window.open(r.url, "_blank", "noopener"))}>
              {r.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Experience">
          {data.roles.map((r) => (
            <CommandItem key={r.title} onSelect={() => run(() => router.push("/#experience"))}>
              {r.title} · {r.dates}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Actions">
          {data.resumeAvailable ? (
            <CommandItem
              onSelect={() =>
                run(() => {
                  const a = document.createElement("a");
                  a.href = "/Bryan-Joseph-Resume.pdf";
                  a.download = "Bryan-Joseph-Resume.pdf";
                  a.click();
                })
              }
            >
              Download résumé
            </CommandItem>
          ) : null}
          <CommandItem
            onSelect={() =>
              run(() => {
                void navigator.clipboard.writeText(data.email);
              })
            }
          >
            Copy email address
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                const next = !document.documentElement.classList.contains("light");
                document.documentElement.classList.toggle("light", next);
                try {
                  localStorage.setItem("theme", next ? "light" : "dark");
                } catch {}
              })
            }
          >
            Toggle theme
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(data.github, "_blank", "noopener"))}>
            Open GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(data.linkedin, "_blank", "noopener"))}>
            Open LinkedIn
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open("https://webmarsimulator.com", "_blank", "noopener"))}>
            Open webmarsimulator.com
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open("https://getstayfitapp.com", "_blank", "noopener"))}>
            Open getstayfitapp.com
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
