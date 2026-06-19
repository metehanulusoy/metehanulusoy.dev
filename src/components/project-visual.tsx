import { cn } from "@/lib/utils";
import { Crest } from "@/components/crest";
import { ProjectTexture } from "@/components/project-texture";

/**
 * The cover for a project without a live-demo screenshot: a flat accent wash
 * (the SSR poster), a faint seeded living texture, and an archetype crest.
 */
export function ProjectVisual({
  seed,
  archetype,
  className,
}: {
  seed?: string;
  archetype?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--card-accent, var(--accent2)) 18%, transparent), transparent 62%), var(--bg-card)",
      }}
    >
      {seed ? (
        <ProjectTexture seed={seed} className="pointer-events-none absolute inset-0 h-full w-full" />
      ) : null}
      {archetype ? <Crest archetype={archetype} /> : null}
    </div>
  );
}
