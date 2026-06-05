"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-reveal wrapper: fades + lifts content into view once. GPU-friendly
 * (opacity/transform only, no layout properties) so it never causes CLS, and
 * fully disabled under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "section" ? motion.section : motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
