import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getProject, projects } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { GithubIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return { title: p.title, description: p.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-36 pb-24 md:px-8">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        projects
      </Link>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span style={{ color: `var(${p.accent})` }}>{p.tags.join(" · ")}</span>
          <span>·</span>
          <span>{p.year}</span>
          <span>·</span>
          <span>{p.status}</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {p.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {p.links.demo ? (
            <a
              href={p.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ background: "var(--grad-cta)" }}
            >
              Live demo <ExternalLink className="size-4" />
            </a>
          ) : null}
          {p.links.github ? (
            <a
              href={p.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent-1"
            >
              <GithubIcon className="size-4" /> Source
            </a>
          ) : null}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: `var(${p.accent})` }}
        >
          Overview
        </h2>
        <p className="mt-3 text-base leading-relaxed text-fg-2">
          {p.description}
        </p>

        <h2
          className="mt-10 font-mono text-xs uppercase tracking-widest"
          style={{ color: `var(${p.accent})` }}
        >
          Tech
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-fg-2"
            >
              {t}
            </span>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
