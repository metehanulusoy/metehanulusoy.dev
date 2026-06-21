import type { PointerEvent } from "react";

const MAX_TILT = 8; // degrees

/* Pointer devices fire far more than 60 moves/sec (120–1000Hz). Coalesce all
   moves into one write per animation frame so the rect read + 4 custom-property
   writes happen at most once per painted frame, not once per raw event. */
let frame = 0;
let pending: { el: HTMLElement; x: number; y: number } | null = null;

function flush() {
  frame = 0;
  const next = pending;
  pending = null;
  if (!next) return;
  const { el, x, y } = next;
  const rect = el.getBoundingClientRect();
  const px = (x - rect.left) / rect.width; // 0..1
  const py = (y - rect.top) / rect.height; // 0..1
  el.style.setProperty("--mx", `${x - rect.left}px`);
  el.style.setProperty("--my", `${y - rect.top}px`);
  el.style.setProperty("--ry", `${(px - 0.5) * MAX_TILT}deg`);
  el.style.setProperty("--rx", `${(0.5 - py) * MAX_TILT}deg`);
}

/**
 * Drives both the cursor spotlight (`--mx`/`--my`) and the 3D tilt
 * (`--rx`/`--ry`) on a `.aurora-card.tilt` element from the pointer position.
 */
export function tiltPointer(e: PointerEvent<HTMLElement>) {
  pending = { el: e.currentTarget, x: e.clientX, y: e.clientY };
  if (!frame) frame = requestAnimationFrame(flush);
}

/** Eases the card back to flat when the pointer leaves. */
export function resetTilt(e: PointerEvent<HTMLElement>) {
  pending = null; // drop any queued tilt so it can't fire after leave
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}
