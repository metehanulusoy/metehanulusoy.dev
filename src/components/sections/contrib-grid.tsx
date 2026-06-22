"use client";

import type { CSSProperties } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const COLS = 13;
const ROWS = 5;

/** Deterministic 0–3 intensity so SSR and client match (no Math.random). */
function level(x: number, y: number): number {
  return (x * 5 + y * 3 + ((x * y) % 4)) % 4;
}

// Cells ordered by (x + y) so the stagger sweeps in as a diagonal wave; grid
// position is pinned with gridColumn/gridRow so the visual layout stays correct.
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: i % COLS,
  y: Math.floor(i / COLS),
})).sort((a, b) => a.x + a.y - (b.x + b.y));

const container: Variants = { show: { transition: { staggerChildren: 0.012 } } };

/**
 * An animated GitHub-style contribution heatmap that fills in as a diagonal wave
 * once it scrolls into view (transform/opacity only; the entrance runs a single
 * time). Decorative.
 */
export function ContribGrid() {
  const reduce = useReducedMotion();
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1 } };

  return (
    <motion.div
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={container}
      className="contrib-grid"
    >
      {CELLS.map((c) => (
        <motion.span
          key={`${c.x}-${c.y}`}
          variants={item}
          className="contrib-cell"
          data-lvl={level(c.x, c.y)}
          style={{ gridColumn: c.x + 1, gridRow: c.y + 1 } as CSSProperties}
        />
      ))}
    </motion.div>
  );
}
