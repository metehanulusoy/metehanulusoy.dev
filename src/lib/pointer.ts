import type { PointerEvent } from "react";

const MAX_TILT = 8; // degrees

/**
 * Drives both the cursor spotlight (`--mx`/`--my`) and the 3D tilt
 * (`--rx`/`--ry`) on a `.aurora-card.tilt` element from the pointer position.
 */
export function tiltPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width; // 0..1
  const py = (e.clientY - rect.top) / rect.height; // 0..1

  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  el.style.setProperty("--ry", `${(px - 0.5) * MAX_TILT}deg`);
  el.style.setProperty("--rx", `${(0.5 - py) * MAX_TILT}deg`);
}

/** Eases the card back to flat when the pointer leaves. */
export function resetTilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}
