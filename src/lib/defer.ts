/**
 * Run a one-off init during browser idle time (requestIdleCallback when
 * supported, else a macrotask fallback), returning a cancel function. Keeps
 * heavy mount work off the rendering/transition frames, so a burst of components
 * mounting together (e.g. a grid of canvases) never piles onto a single frame.
 * SSR-safe: no-ops on the server.
 */
export function deferIdle(cb: () => void, timeout = 500): () => void {
  if (typeof window === "undefined") return () => {};
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 1);
  return () => window.clearTimeout(id);
}
