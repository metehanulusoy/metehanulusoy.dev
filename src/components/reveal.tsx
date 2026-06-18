"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { reducedItem, sectionReveal } from "@/lib/motion";

/** Fade + rise into view once; collapses to a plain fade under reduced motion. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={reduce ? reducedItem : sectionReveal}
    >
      {children}
    </motion.div>
  );
}
