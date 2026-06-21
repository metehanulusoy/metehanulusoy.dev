/**
 * The signature breathing aurora — CSS-only drifting blobs. No scroll- or
 * cursor-coupling on purpose: scrolling never touches this layer, so it can't
 * cause jank. The slow drift runs entirely on the compositor and globals.css
 * pins it static under prefers-reduced-motion. Pure markup → a Server Component
 * (zero client JS).
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="absolute inset-0">
        <div className="aurora-blob aurora-a" />
        <div className="aurora-blob aurora-b" />
        <div className="aurora-blob aurora-c" />
      </div>
      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
