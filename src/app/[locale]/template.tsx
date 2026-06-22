"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

// Persists across the template's per-navigation remounts, so we can tell the
// initial page load from a subsequent client navigation.
let hasNavigated = false;

/** Page-enter transition (runs on every route change). */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    // Start every navigation from the top (behavior 'auto' → no visible smooth
    // scroll, so the look is unchanged) and move focus to the main landmark on
    // client navigations — not the initial load — for keyboard/SR users.
    window.scrollTo({ top: 0, behavior: "auto" });
    if (hasNavigated) {
      document.getElementById("main")?.focus({ preventScroll: true });
    } else {
      hasNavigated = true;
    }
  }, []);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
