"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { projectTags, sortedProjects, type Project } from "@/data/projects";
import { resetTilt, tiltPointer } from "@/lib/pointer";
import { ProjectCover } from "@/components/project-cover";
import { cn } from "@/lib/utils";

export function ProjectsExplorer() {
  const [tag, setTag] = useState("all");
  const t = useTranslations("projects");
  const reduce = useReducedMotion();
  const all = sortedProjects();
  const list = tag === "all" ? all : all.filter((p) => p.tags.includes(tag));

  const chipLabel = (tg: string) =>
    tg === "all" ? t("filters.all") : tg === "private" ? t("filters.private") : tg;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
      <h2 className="sr-only">{t("title")}</h2>
      <div role="group" aria-label={t("filters.label")} className="flex flex-wrap gap-2">
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
            {chipLabel(tg)}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t("resultCount", { count: list.length })}
      </p>

      <motion.div
        layout={!reduce}
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p) =>
            p.locked ? (
              <LockedCard key={p.slug} p={p} reduce={!!reduce} />
            ) : (
              <ProjectCard key={p.slug} p={p} reduce={!!reduce} />
            ),
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const CARD_TRANSITION: Transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

function cardMotion(reduce: boolean) {
  return {
    layout: !reduce,
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
    transition: CARD_TRANSITION,
  };
}

function ProjectCard({ p, reduce }: { p: Project; reduce: boolean }) {
  const t = useTranslations("projects");
  return (
    <motion.div {...cardMotion(reduce)}>
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
            {p.year} · {t(`status.${p.status}`)}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-fg">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-fg-2"
            >
              {tech}
            </span>
          ))}
        </div>
        <span
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm"
          style={{ color: `var(${p.accent})` }}
        >
          {t("view")}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}

/** A private repository: the name is shown with a lock, but it isn't clickable
 *  and has no description, tech, or detail page. */
function LockedCard({ p, reduce }: { p: Project; reduce: boolean }) {
  const t = useTranslations("projects");
  return (
    <motion.div {...cardMotion(reduce)}>
      <div
        aria-label={`${p.title} — ${t("locked.aria")}`}
        style={{ "--card-accent": `var(${p.accent})` } as CSSProperties}
        className="aurora-card flex h-full cursor-default select-none flex-col p-6 opacity-95"
      >
        <span aria-hidden className="card-glow" />
        <div
          className="mb-5 grid aspect-[16/7] w-full place-items-center overflow-hidden rounded-xl border border-border"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--card-accent) 14%, transparent), transparent 60%), var(--bg-card)",
          }}
        >
          <Lock className="size-7" style={{ color: `var(${p.accent})` }} aria-hidden />
        </div>
        <span
          className="font-mono text-[11px] uppercase tracking-wider"
          style={{ color: `var(${p.accent})` }}
        >
          {t("locked.note")}
        </span>
        <h3 className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-fg">
          <Lock className="size-4 shrink-0 text-muted" aria-hidden />
          {p.title}
        </h3>
        <div className="flex-1" />
      </div>
    </motion.div>
  );
}
