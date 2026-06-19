"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* The WebGL field is loaded lazily (after idle) and never server-rendered, so
   it stays out of the initial bundle and off the LCP path. */
const AuroraCanvas = dynamic(
  () => import("@/components/aurora-canvas").then((m) => m.AuroraCanvas),
  { ssr: false },
);

/** The signature breathing aurora stage — parallaxes on scroll, drifts toward the
 *  cursor, and (post-idle, motion allowed) upgrades from CSS blobs to a flowing
 *  WebGL field that fades in over them. */
export function AuroraBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);
  const px = useSpring(0, { stiffness: 60, damping: 18 });
  const py = useSpring(0, { stiffness: 60, damping: 18 });
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 36);
      py.set((e.clientY / window.innerHeight - 0.5) * 36);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  useEffect(() => {
    if (reduce) return;
    const schedule = window.requestIdleCallback;
    if (schedule) {
      const id = schedule(() => setLive(true));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setLive(true), 200);
    return () => window.clearTimeout(id);
  }, [reduce]);

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
      {live ? <AuroraCanvas /> : null}
      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
