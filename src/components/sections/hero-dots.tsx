/**
 * Hero backdrop (concept #6): a fixed dot-matrix grid with a soft light wave
 * sweeping across it. Performance trick — the dots live in a static layer masked
 * to a dot pattern; only a single light band TRANSLATES across (composited
 * transform, no per-frame paint, no scroll coupling). Right-weighted so it never
 * fights the hero text, and frozen under prefers-reduced-motion. Server Component.
 */
export function HeroDots() {
  return (
    <div aria-hidden className="hero-dots">
      <div className="hero-dots-inner">
        <div className="hero-dots-base" />
        <div className="hero-dots-band" />
      </div>
    </div>
  );
}
