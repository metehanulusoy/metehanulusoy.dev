import type { CSSProperties } from "react";

const COLS = 13;
const ROWS = 5;

/** Deterministic 0–3 intensity (no Math.random → SSR/client match). */
function level(x: number, y: number): number {
  return (x * 5 + y * 3 + ((x * y) % 4)) % 4;
}

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: i % COLS,
  y: Math.floor(i / COLS),
}));

/**
 * A GitHub-style contribution heatmap. The cells are always visible (colored by
 * intensity) and a soft diagonal shimmer travels across them (opacity only →
 * composited; the per-cell delay keyed off x+y makes the wave). Pure markup → a
 * Server Component; frozen under prefers-reduced-motion.
 */
export function ContribGrid() {
  return (
    <div aria-hidden className="contrib-grid">
      {CELLS.map((c) => (
        <span
          key={`${c.x}-${c.y}`}
          className="contrib-cell"
          data-lvl={level(c.x, c.y)}
          style={{ animationDelay: `${((c.x + c.y) * 0.12).toFixed(2)}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
