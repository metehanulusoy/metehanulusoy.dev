import Image from "next/image";
import { ProjectVisual } from "@/components/project-visual";
import { Crest } from "@/components/crest";
import { cn } from "@/lib/utils";

/**
 * A project's cover: a real screenshot of its live demo when available (with an
 * archetype crest on top), otherwise a seeded accent panel via ProjectVisual.
 */
export function ProjectCover({
  cover,
  title,
  seed,
  archetype,
  className,
}: {
  cover?: string;
  title: string;
  seed?: string;
  archetype?: string;
  className?: string;
}) {
  if (cover) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={cover}
          alt={`${title} preview`}
          fill
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 90vw"
          className="object-cover object-top"
        />
        {archetype ? <Crest archetype={archetype} /> : null}
      </div>
    );
  }
  return <ProjectVisual seed={seed} archetype={archetype} className={className} />;
}
