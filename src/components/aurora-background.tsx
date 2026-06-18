"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** The signature breathing aurora stage, fixed behind all content. */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y }}
      >
        <div className="aurora-blob aurora-a" />
        <div className="aurora-blob aurora-b" />
        <div className="aurora-blob aurora-c" />
      </motion.div>
      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
