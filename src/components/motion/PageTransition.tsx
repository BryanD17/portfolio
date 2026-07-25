"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * 220ms opacity crossfade plus an 8px rise on the entering page. Nothing
 * longer. Disabled under reduced motion.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { reduced } = useReducedMotionSafe();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: DURATION.page, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
