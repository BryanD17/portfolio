"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Terminal } from "@/components/ui/Terminal";
import { Prompt } from "@/components/ui/Prompt";
import { Cursor } from "@/components/ui/Cursor";
import { Metric } from "@/components/ui/Metric";
import { Button } from "@/components/ui/button";
import {
  ReducedMotionOverride,
} from "@/components/motion/useReducedMotionSafe";
import { ScrollLinked } from "@/components/motion/ScrollLinked";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { AmbientBackdrop } from "@/components/motion/AmbientBackdrop";
import { MagneticCard } from "@/components/motion/MagneticCard";
import { TypeLine } from "@/components/motion/TypeLine";

export function MotionLab() {
  const [forceReduced, setForceReduced] = useState(false);
  const [typed, setTyped] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <ReducedMotionOverride value={forceReduced ? true : null}>
      <main className="mx-auto flex max-w-4xl flex-col gap-20 px-4 py-16 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            index="00"
            label="motion-lab"
            title="Motion system"
            description="Every primitive in isolation. Toggle reduced motion to review both states side by side. This page is noindexed."
          />
          <div className="flex gap-2">
            <Button
              variant={forceReduced ? "default" : "outline"}
              onClick={() => setForceReduced((v) => !v)}
              aria-pressed={forceReduced}
            >
              Reduced motion: {forceReduced ? "ON" : "off"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTyped(false);
                setReplayKey((k) => k + 1);
              }}
            >
              Replay
            </Button>
          </div>
        </div>

        <section key={replayKey} className="flex flex-col gap-16">
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">TypeLine + SplitText (boot sync)</h3>
            <Terminal>
              <p>
                <Prompt />
                <TypeLine text="cat headline.txt" seed={2} onDone={() => setTyped(true)} />
                <Cursor />
              </p>
            </Terminal>
            <SplitText
              text="I ship production software."
              as="h2"
              start={typed}
              className="font-mono text-4xl font-semibold text-fg"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">CountUp (separators during count, decimals)</h3>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Metric value="80,000" suffix="+" label="lines of Swift" valueSlot={<CountUp to={80000} />} />
              <Metric value="15,000" suffix="+" label="lines of TS" valueSlot={<CountUp to={15000} />} />
              <Metric value="3.85" label="GPA" valueSlot={<CountUp to={3.85} decimals={2} />} />
              <Metric value="100" suffix="+" label="students" valueSlot={<CountUp to={100} />} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">RevealOnScroll (fires once)</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <RevealOnScroll key={i} delay={i * 0.09}>
                  <div className="rounded-md border border-border bg-bg-elevated p-6 font-mono text-sm text-fg-muted">
                    card {i + 1}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">MagneticCard (hover pointer only)</h3>
            <MagneticCard className="p-8">
              <p className="font-mono text-sm text-fg-muted">
                Move the cursor across this card. Touch devices and reduced motion get a border
                color change only.
              </p>
            </MagneticCard>
          </div>

          <div className="relative flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">AmbientBackdrop (canvas, pausable)</h3>
            <div className="relative h-64 overflow-hidden rounded-lg border border-border">
              <AmbientBackdrop />
              <p className="relative p-6 font-mono text-sm text-fg-muted">
                Two gradient blobs on a 20s loop. Pauses off-screen and on tab hide; absent below
                768px; static gradient under reduced motion.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-lg text-fg">ScrollLinked + ParallaxLayer</h3>
            <ScrollLinked y={[40, -40]} opacity={[0.4, 1]}>
              <div className="rounded-md border border-border bg-bg-elevated p-6 font-mono text-sm text-fg-muted">
                This block maps scroll progress continuously to y and opacity.
              </div>
            </ScrollLinked>
            <ParallaxLayer travel={16}>
              <div className="rounded-md border border-accent/40 bg-bg-elevated p-6 font-mono text-sm text-accent">
                Parallax plane, 16px travel on SPRING_DRIFT.
              </div>
            </ParallaxLayer>
          </div>

          <div className="h-[40vh]" aria-hidden="true" />
        </section>
      </main>
    </ReducedMotionOverride>
  );
}
