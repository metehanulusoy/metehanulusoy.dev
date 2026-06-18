import { cn } from "@/lib/utils";

/**
 * A plain, accent-tinted cover for projects that have no live-demo screenshot —
 * just a soft wash of the card's hue, no graphics.
 */
export function ProjectVisual({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--card-accent, var(--accent2)) 20%, transparent), transparent 62%), var(--bg-card)",
      }}
    />
  );
}
