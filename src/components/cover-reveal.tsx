"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Unfolds the project detail hero into view on load — it scales up and clip-wipes
 * open from the center, echoing the feel of the card expanding into the page.
 * Reduced motion gets a plain fade.
 */
export function CoverReveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.94, clipPath: "inset(10% 7% 10% 7% round 1rem)" }
      }
      animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
      transition={{ duration: reduce ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
