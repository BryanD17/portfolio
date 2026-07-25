"use client";

import { useState } from "react";
import { Terminal } from "@/components/ui/Terminal";
import { Prompt } from "@/components/ui/Prompt";
import { Cursor } from "@/components/ui/Cursor";
import { Metric } from "@/components/ui/Metric";
import { TypeLine } from "@/components/motion/TypeLine";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { TerminalInput } from "@/components/interactive/TerminalInput";

interface BootLine {
  command: string;
  output: string[];
}

interface Stat {
  value?: number;
  text?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

interface HeroBootProps {
  bootLines: BootLine[];
  headline: string;
  stats: Stat[];
  resumeAvailable?: boolean;
}

/**
 * The boot choreography: each line types with varied per-character timing,
 * its output prints, and the next line begins. When `cat headline.txt`
 * resolves, the split-text headline fires; the metrics start counting 200ms
 * after the headline settles, staggered 80ms apart. Under reduced motion
 * everything renders instantly and completely.
 */
export function HeroBoot({ bootLines, headline, stats, resumeAvailable = false }: HeroBootProps) {
  const { reduced } = useReducedMotionSafe();
  // Index of the line currently typing; lines below it are fully printed.
  const [stage, setStage] = useState(0);
  const [headlineFired, setHeadlineFired] = useState(false);

  const headlineLineIndex = bootLines.findIndex((l) => l.command === "cat headline.txt");
  const advance = (i: number) => {
    setStage((s) => Math.max(s, i + 1));
    if (i === headlineLineIndex) {
      setHeadlineFired(true);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Terminal title="bryan@portfolio: ~">
        {bootLines.map((line, i) => (
          <div key={line.command} className={!reduced && stage < i ? "invisible" : undefined}>
            <p>
              <Prompt />
              <TypeLine text={line.command} start={reduced || stage >= i} seed={i + 1} onDone={() => advance(i)} />
              {!reduced && stage === i ? <Cursor /> : null}
            </p>
            <div className={!reduced && stage <= i ? "invisible" : undefined}>
              {line.output.map((out) => (
                <p key={out} className="whitespace-pre-wrap text-fg-muted">
                  {out}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div className={!reduced && stage < bootLines.length ? "invisible" : undefined}>
          <TerminalInput resumeAvailable={resumeAvailable} />
        </div>
      </Terminal>

      <SplitText
        text={headline}
        as="h1"
        per="word"
        start={reduced || headlineFired}
        className="font-mono text-4xl font-semibold text-fg sm:text-5xl lg:text-6xl"
      />

      <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <Metric
              value={stat.text ?? String(stat.value ?? "")}
              suffix={stat.suffix}
              label={stat.label}
              valueSlot={
                stat.value !== undefined ? (
                  <CountUp
                    to={stat.value}
                    decimals={stat.decimals ?? 0}
                    startOnView={false}
                    start={reduced || headlineFired}
                    delay={0.2 + i * 0.08}
                  />
                ) : undefined
              }
            />
          </div>
        ))}
      </dl>
    </div>
  );
}
