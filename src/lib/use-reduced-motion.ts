"use client";

import { useEffect, useState } from "react";

/**
 * Whether the user prefers reduced motion. Unlike motion's own
 * `useReducedMotion` (which reads the preference once and never updates), this
 * re-renders when the OS setting flips mid-session, so JS-driven animations can
 * tear down live. Starts `false` on the server and the first client paint to
 * keep hydration deterministic, then corrects in an effect.
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}
