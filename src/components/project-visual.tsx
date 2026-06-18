import { cn } from "@/lib/utils";

/**
 * Generative, accent-tinted SVG cover for a project — a neural-graph motif for
 * AI/ML/web/systems work and a chart motif for finance. Uses `currentColor`
 * (set from the card's --card-accent) so each card reads as its own hue.
 */
export function ProjectVisual({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  const finance = tags.includes("finance");

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{ color: "var(--card-accent, var(--accent2))" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 15% 10%, color-mix(in oklch, currentColor 28%, transparent), transparent 60%), radial-gradient(120% 120% at 90% 90%, color-mix(in oklch, currentColor 16%, transparent), transparent 55%), var(--bg-card)",
        }}
      />
      <svg
        viewBox="0 0 400 170"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {finance ? <ChartMotif /> : <GraphMotif />}
      </svg>
    </div>
  );
}

function GraphMotif() {
  const nodes = [
    [60, 45],
    [60, 125],
    [160, 85],
    [160, 30],
    [160, 140],
    [260, 55],
    [260, 120],
    [345, 85],
  ] as const;
  const edges = [
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 4],
    [2, 5],
    [2, 6],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 7],
  ] as const;

  return (
    <g>
      <g stroke="currentColor" strokeWidth={1} opacity={0.35}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 6 : 4}
            className="viz-node"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}
      </g>
    </g>
  );
}

function ChartMotif() {
  const pts = [10, 60, 35, 80, 55, 100, 90, 130, 110, 160] as const;
  // build a rising line across the width
  const coords = Array.from({ length: 9 }, (_, i) => {
    const x = 30 + i * 45;
    const y = 140 - (pts[i] ?? 80) * 0.7 - i * 4;
    return [x, Math.max(20, y)] as const;
  });
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `30,150 ${line} ${coords[coords.length - 1][0]},150`;

  return (
    <g>
      <g stroke="currentColor" strokeWidth={1} opacity={0.18}>
        {[40, 75, 110].map((y) => (
          <line key={y} x1={20} y1={y} x2={380} y2={y} />
        ))}
      </g>
      <polygon points={area} fill="currentColor" opacity={0.14} />
      <polyline
        points={line}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3}
          fill="currentColor"
          className="viz-node"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </g>
  );
}
