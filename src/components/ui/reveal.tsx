"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal wrapper — one motion definition for the whole site so
 * every section shares the same rhythm (§ motion-consistency). Subtle fade-up,
 * matches the Journey timeline's tokens (0.4s, easeOut, 50ms stagger).
 * Fully gated behind prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
