"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SPRING_SNAP, STAGGER, cappedStagger } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import type { Skill } from "@/content/schema";

/**
 * Skill chips stagger in on a 40ms wave in reading order. Hover scales to
 * 1.04 with SPRING_SNAP and highlights the chip's linked projects elsewhere
 * on the page (cards carry data-proj attributes). Every chip links to its
 * evidence by filtering the projects grid; no ratings, no percentages.
 */
export function SkillChips({ skills }: { skills: Skill[] }) {
  const { reduced } = useReducedMotionSafe();

  const setHighlight = (skill: Skill, on: boolean) => {
    for (const key of skill.evidence) {
      for (const el of document.querySelectorAll(`[data-proj="${CSS.escape(key)}"]`)) {
        el.classList.toggle("skill-highlight", on);
      }
    }
  };

  return (
    <motion.ul
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: cappedStagger(skills.length, STAGGER.tight) } },
      }}
      className="flex flex-wrap gap-2"
    >
      {skills.map((skill) => (
        <motion.li
          key={skill.name}
          data-reveal
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0, transition: SPRING_SNAP },
          }}
          whileHover={reduced ? undefined : { scale: 1.04 }}
          transition={SPRING_SNAP}
          onHoverStart={() => setHighlight(skill, true)}
          onHoverEnd={() => setHighlight(skill, false)}
        >
          <Link
            href={`/projects?q=${encodeURIComponent(skill.name)}`}
            className={
              skill.top
                ? "inline-flex items-center rounded-sm border border-accent/50 bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-accent"
                : "inline-flex items-center rounded-sm border border-border bg-bg-subtle px-2.5 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            }
          >
            {skill.name}
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
