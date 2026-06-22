/**
 * A vertical "spine" pinned to the left margin that draws itself as you scroll
 * (concept #1). The fill and the glowing leading dot are driven by a CSS
 * scroll-driven animation (animation-timeline: scroll) → compositor, zero JS.
 * Shown only on wide screens (where there's a clear margin); a Server Component.
 */
export function ScrollSpine() {
  return (
    <div aria-hidden className="scroll-spine">
      <span className="scroll-spine-track" />
      <span className="scroll-spine-fill" />
      <span className="scroll-spine-node" style={{ top: "0%" }} />
      <span className="scroll-spine-node" style={{ top: "33.333%" }} />
      <span className="scroll-spine-node" style={{ top: "66.666%" }} />
      <span className="scroll-spine-node" style={{ top: "100%" }} />
      <span className="scroll-spine-dot" />
    </div>
  );
}
