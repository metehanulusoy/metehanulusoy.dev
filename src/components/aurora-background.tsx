"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** The signature breathing aurora stage — soft CSS blobs that parallax on scroll
 *  and drift toward the cursor. Reduced motion pins it static. */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);
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
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { x: px, y: py }}
        >
          <div className="aurora-blob aurora-a" />
          <div className="aurora-blob aurora-b" />
          <div className="aurora-blob aurora-c" />
        </motion.div>
      </motion.div>
      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
