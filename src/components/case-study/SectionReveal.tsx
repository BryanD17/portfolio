"use client";

import { ScrollLinked } from "@/components/motion/ScrollLinked";

/**
 * Case-study body sections: scroll-linked fade + 20px rise as the section
 * enters the middle third of the viewport. Continuous, not triggered.
 */
export function SectionReveal({ children }: { children: React.ReactNode }) {
  // The dimmed start state stays at 0.8 so pre-reveal text still passes AA
  // contrast for anyone reading ahead of the scroll position.
  return (
    <ScrollLinked offset={["start end", "start center"]} y={[20, 0]} opacity={[0.8, 1]}>
      {children}
    </ScrollLinked>
  );
}
