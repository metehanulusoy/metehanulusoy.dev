"use client";

import { motion, useScroll } from "motion/react";

/** A thin gradient bar pinned to the top that fills as you scroll the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX: scrollYProgress, background: "var(--grad-nav-progress)" }}
    />
  );
}
