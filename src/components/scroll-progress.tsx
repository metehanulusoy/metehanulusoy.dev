/**
 * A thin gradient bar pinned to the top that fills as you scroll. Driven entirely
 * by a CSS scroll-driven animation (.scroll-progress-bar in globals.css) — zero
 * JS on scroll, so it runs on the compositor. Scroll-linked indicator (moves 1:1
 * with the user's own scroll); hidden where scroll timelines are unsupported.
 * Pure markup → a Server Component.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="scroll-progress-bar fixed inset-x-0 top-0 z-[60] h-0.5"
      style={{ background: "var(--grad-nav-progress)" }}
    />
  );
}
