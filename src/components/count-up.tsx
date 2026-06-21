"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Animates the first number found in `value` from 0 up to its target when it
 * scrolls into view (e.g. "21 public repos" counts 0 → 21). Non-numeric
 * strings render unchanged; reduced-motion shows the final value immediately.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/\d[\d.,]*/);
  const target = match ? Number(match[0].replace(/[.,]/g, "")) : null;

  const [n, setN] = useState(target ?? 0);

  useEffect(() => {
    // Initial state is already `target`, so reduced-motion / not-yet-visible
    // need no work — just animate up from 0 once it scrolls into view.
    if (target === null || reduce || !inView) return;
    const duration = 900;
    let raf = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const p = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  if (target === null) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {value.replace(match![0], n.toLocaleString())}
    </span>
  );
}
