"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Prompt } from "@/components/ui/Prompt";

interface HistoryEntry {
  command: string;
  output: string[];
}

const HELP: string[] = [
  "available commands:",
  "  help              show this list",
  "  whoami            who owns this terminal",
  "  ls shipped        list shipped projects",
  "  cd stayfit        open the StayFit case study",
  "  cd stayfit-web    open the StayFit Website case study",
  "  cd webmars        open the WebMARS case study",
  "  cd futures-engine open the Futures Engine case study",
  "  cat resume        download the resume",
  "  contact           jump to the contact form",
  "  theme             toggle light/dark",
  "  clear             clear the terminal",
  "  sudo              try it",
];

/**
 * The hero terminal easter egg. Twelve commands, `help` discoverable, and
 * entirely optional: the input sits in normal tab order at its DOM position
 * and never steals focus.
 */
export function TerminalInput({ resumeAvailable }: { resumeAvailable: boolean }) {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [value, setValue] = useState("");

  function runCommand(raw: string): string[] | "clear" | null {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    switch (cmd) {
      case "help":
        return HELP;
      case "whoami":
        return ["Bryan Djenabia Joseph"];
      case "ls":
      case "ls shipped":
      case "ls ./shipped":
        return ["stayfit/    stayfit-web/    webmars/    futures-engine/"];
      case "cd stayfit":
        router.push("/projects/stayfit");
        return ["opening ~/shipped/stayfit"];
      case "cd stayfit-web":
      case "cd stayfit-website":
        router.push("/projects/stayfit-website");
        return ["opening ~/shipped/stayfit-web"];
      case "cd webmars":
        router.push("/projects/webmars");
        return ["opening ~/shipped/webmars"];
      case "cd futures-engine":
        router.push("/projects/futures-engine");
        return ["opening ~/shipped/futures-engine"];
      case "cat resume":
        if (resumeAvailable) {
          const a = document.createElement("a");
          a.href = "/Bryan-Joseph-Resume.pdf";
          a.download = "Bryan-Joseph-Resume.pdf";
          a.click();
          return ["downloading Bryan-Joseph-Resume.pdf"];
        }
        return ["resume: not published yet. email bdjenabia5@gmail.com instead."];
      case "contact":
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        return ["scrolling to #contact"];
      case "theme": {
        const next = !document.documentElement.classList.contains("light");
        document.documentElement.classList.toggle("light", next);
        try {
          localStorage.setItem("theme", next ? "light" : "dark");
        } catch {}
        return [`theme: ${next ? "light" : "dark"}`];
      }
      case "clear":
        return "clear";
      case "sudo":
      case "sudo su":
        return ["Permission denied: nice try."];
      case "":
        return null;
      default:
        return [`command not found: ${cmd}. type "help".`];
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const result = runCommand(value);
    if (result === "clear") {
      setHistory([]);
    } else if (result !== null) {
      setHistory((h) => [...h.slice(-20), { command: value, output: result }]);
    }
    setValue("");
  }

  return (
    <div aria-live="polite">
      {history.map((entry, i) => (
        <div key={`${entry.command}-${i}`}>
          <p>
            <Prompt />
            <span className="text-fg">{entry.command}</span>
          </p>
          {entry.output.map((line) => (
            <p key={line} className="whitespace-pre-wrap text-fg-muted">
              {line}
            </p>
          ))}
        </div>
      ))}
      <p className="flex items-center">
        <Prompt />
        <label htmlFor="hero-terminal-input" className="sr-only">
          Terminal input. Type help and press Enter for commands.
        </label>
        <input
          id="hero-terminal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          placeholder='type "help"'
          className="w-40 flex-1 bg-transparent font-mono text-sm text-fg caret-[var(--accent)] outline-none placeholder:text-fg-subtle/60"
        />
      </p>
    </div>
  );
}
