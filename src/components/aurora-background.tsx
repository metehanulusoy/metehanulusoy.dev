"use client";

import { useEffect } from "react";
import { motion, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The signature breathing aurora. Two layers of movement, both off the main
 * thread for smooth scrolling:
 *  - scroll parallax → a CSS scroll-driven animation (.aurora-parallax in
 *    globals.css), so scrolling does zero JS;
 *  - cursor lean → a Motion spring driven by pointermove (desktop only, not
 *    scroll-coupled).
 * Blobs drift on the compositor; reduced motion pins everything static.
 */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const px = useSpring(0, { stiffness: 60, damping: 18 });
  const py = useSpring(0, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 36);
      py.set((e.clientY / window.innerHeight - 0.5) * 36);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="aurora-parallax absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { x: px, y: py }}
        >
          <div className="aurora-blob aurora-a" />
          <div className="aurora-blob aurora-b" />
          <div className="aurora-blob aurora-c" />
        </motion.div>
      </div>
      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
