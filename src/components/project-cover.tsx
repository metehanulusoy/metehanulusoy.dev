import Image from "next/image";
import { ProjectVisual } from "@/components/project-visual";
import { cn } from "@/lib/utils";

/**
 * A project's cover: a real screenshot of its live demo when available,
 * otherwise a plain accent-tinted panel.
 */
export function ProjectCover({
  cover,
  title,
  className,
}: {
  cover?: string;
  title: string;
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
      </div>
    );
  }
  return <ProjectVisual className={className} />;
}
