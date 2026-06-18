import type { PointerEvent } from "react";

/**
 * Tracks the pointer position inside an element as `--mx`/`--my` CSS variables,
 * used to drive the cursor-following spotlight on `.aurora-card`.
 */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
