"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projectTags, sortedProjects, type Project } from "@/data/projects";
import { resetTilt, tiltPointer } from "@/lib/pointer";
import { ProjectCover } from "@/components/project-cover";
import { cn } from "@/lib/utils";

export function ProjectsExplorer() {
  const [tag, setTag] = useState("all");
  const reduce = useReducedMotion();
  const all = sortedProjects();
  const list = tag === "all" ? all : all.filter((p) => p.tags.includes(tag));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
      <h2 className="sr-only">All projects</h2>
      <div className="flex flex-wrap gap-2">
        {projectTags.map((tg) => (
          <button
            key={tg}
            type="button"
            onClick={() => setTag(tg)}
            aria-pressed={tag === tg}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
              tag === tg
                ? "border-accent-1 text-fg"
                : "border-border text-muted hover:text-fg-2",
            )}
          >
            {tg}
          </button>
        ))}
      </div>

      <motion.div
        layout={!reduce}
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProjectCard key={p.slug} p={p} reduce={!!reduce} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function ProjectCard({ p, reduce }: { p: Project; reduce: boolean }) {
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: 0.25 } }
      }
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/projects/${p.slug}`}
        onPointerMove={tiltPointer}
        onPointerLeave={resetTilt}
        style={{ "--card-accent": `var(${p.accent})` } as CSSProperties}
        className="aurora-card tilt group flex h-full flex-col p-6"
      >
        <span aria-hidden className="card-glow" />
        <ProjectCover
          cover={p.cover}
          title={p.title}
          seed={p.slug}
          archetype={p.tags[0]}
          className="mb-5 aspect-[16/7] w-full rounded-xl border border-border"
        />
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[11px] uppercase tracking-wider"
            style={{ color: `var(${p.accent})` }}
          >
            {p.tags.join(" · ")}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {p.year} · {p.status}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-fg">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-fg-2"
            >
              {t}
            </span>
          ))}
        </div>
        <span
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm"
          style={{ color: `var(${p.accent})` }}
        >
          View
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
