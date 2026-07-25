"use client";

import { useRef, useState } from "react";
import { motion, useScroll } from "motion/react";
import { differenceInCalendarMonths, format, parse } from "date-fns";
import { SPRING_SNAP, SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/button";
import type { Position } from "@/content/schema";

function parseMonth(value: string): Date {
  return parse(value, "yyyy-MM", new Date());
}

/** LinkedIn-style inclusive month count: Jun to Aug reads as 3 months. */
export function durationMonths(start: string, end: string | null): number {
  const endDate = end ? parseMonth(end) : new Date();
  return differenceInCalendarMonths(endDate, parseMonth(start)) + 1;
}

function formatRange(start: string, end: string | null): string {
  const s = format(parseMonth(start), "MMM yyyy");
  const e = end ? format(parseMonth(end), "MMM yyyy") : "Present";
  const months = durationMonths(start, end);
  return `${s} - ${e} (${months} month${months === 1 ? "" : "s"})`;
}

interface ExperienceTimelineProps {
  organization: string;
  program?: string;
  location: string;
  combinedSummary: string;
  roles: Position[];
}

/**
 * THE SPINE DRAW: the vertical line's scaleY is bound DIRECTLY to scroll
 * progress through the section (offset ["start center", "end center"]), so
 * it draws under the reader's scroll and retreats when they scroll back up.
 * Each role's node pops with SPRING_SNAP as the spine passes it (viewport
 * center) and its card follows 60ms behind from the spine side.
 */
export function ExperienceTimeline({
  organization,
  program,
  location,
  combinedSummary,
  roles,
}: ExperienceTimelineProps) {
  const { reduced } = useReducedMotionSafe();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  const collapsed = isMobile && !expanded;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-mono text-xl font-semibold text-fg">{organization}</h3>
        <p className="font-mono text-xs text-fg-subtle">
          {program ? `${program} · ` : ""}
          {location}
        </p>
        <p className="max-w-2xl text-base text-fg-muted">{combinedSummary}</p>
      </div>

      {isMobile ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="w-fit font-mono text-xs"
        >
          {expanded ? "collapse roles" : `show all ${roles.length} roles`}
        </Button>
      ) : null}

      {collapsed ? (
        <ul className="flex flex-col gap-2">
          {roles.map((role) => (
            <li key={role.title} className="flex flex-wrap items-baseline gap-x-3 font-mono text-sm">
              <span className="text-fg">{role.title}</span>
              <span className="text-xs text-fg-subtle">{formatRange(role.startDate, role.endDate)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative">
          {/* Spine track + scroll-bound draw. Fully drawn under reduced motion. */}
          <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
          <motion.div
            aria-hidden="true"
            data-reveal
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />

          <ol ref={listRef} className="flex flex-col gap-10">
            {roles.map((role) => (
              <li key={role.title} className="relative pl-10">
                {/* Node */}
                {reduced ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 size-[15px] rounded-lg border-2 border-accent bg-bg"
                  />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    data-reveal
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-50% 0px -45% 0px" }}
                    transition={SPRING_SNAP}
                    className="absolute left-0 top-1 size-[15px] rounded-lg border-2 border-accent bg-bg"
                  />
                )}

                {/* Card, 60ms behind its node, sliding in from the spine side. */}
                <motion.div
                  data-reveal
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50% 0px -45% 0px" }}
                  transition={reduced ? undefined : { ...SPRING_SOFT, delay: 0.06 }}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-bg-elevated p-5"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="font-mono text-base font-semibold text-fg">{role.title}</h4>
                    <p className="font-mono text-xs text-fg-subtle">
                      {formatRange(role.startDate, role.endDate)}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-fg-muted">{role.description}</p>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Skills used in this role">
                    {role.skills.map((skill) => (
                      <li key={skill}>
                        <Tag>{skill}</Tag>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
