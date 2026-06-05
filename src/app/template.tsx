"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Next re-mounts `template.tsx` on every navigation, making it the natural home
 * for a subtle page-enter transition. Server-rendered children pass straight
 * through, so this stays a thin client boundary. Disabled under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
