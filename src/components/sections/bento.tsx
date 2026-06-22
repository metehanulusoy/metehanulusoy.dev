"use client";

import type { CSSProperties, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { motion, type Variants } from "motion/react";
import { Activity, ArrowUpRight, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { cardContainer, cardItem } from "@/lib/motion";
import { useMotionVariants } from "@/lib/use-motion-variants";
import { resetTilt, tiltPointer } from "@/lib/pointer";
import { CountUp } from "@/components/count-up";
import { ContribGrid } from "@/components/sections/contrib-grid";
import { ProjectVisual } from "@/components/project-visual";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const TECH = ["scikit-learn", "XGBoost", "FastAPI"];

const CONNECT = [
  { Icon: GithubIcon, href: "https://github.com/metehanulusoy", handle: "@metehanulusoy" },
  { Icon: LinkedinIcon, href: "https://www.linkedin.com/in/metehanulusoy", handle: "in/metehanulusoy" },
];

function Card({
  accent,
  className,
  id,
  item,
  children,
}: {
  accent: string;
  className?: string;
  id?: string;
  item: Variants;
  children: ReactNode;
}) {
  return (
    <motion.div
      id={id}
      variants={item}
      className={cn(id && "scroll-mt-24", className)}
    >
      <div
        onPointerMove={tiltPointer}
        onPointerLeave={resetTilt}
        style={{ "--card-accent": `var(${accent})` } as CSSProperties}
        className="aurora-card tilt flex h-full flex-col p-6"
      >
        <span aria-hidden className="card-glow" />
        {children}
      </div>
    </motion.div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-widest text-muted">
      {children}
    </span>
  );
}

type LatestPost = { slug: string; title: string; description: string } | null;

export function Bento({ latest }: { latest: LatestPost }) {
  const t = useTranslations("bento");
  const nowT = useTranslations("now");
  const { container, item } = useMotionVariants(cardContainer, cardItem);

  const nowItems = (nowT.raw("focus") as string[]).slice(0, 3);

  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:px-8">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={item}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent-2">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {t("title")}
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8% 0px" }}
        variants={container}
        className="mt-10 grid grid-cols-1 gap-4 lg:auto-rows-[minmax(160px,auto)] lg:grid-cols-12"
      >
        {/* Featured project — violet */}
        <Card accent="--accent2" item={item} className="lg:col-span-7 lg:row-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardLabel>{t("featured.label")}</CardLabel>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{
                color: "var(--accent4)",
                border:
                  "1px solid color-mix(in oklch, var(--accent4) 45%, transparent)",
              }}
            >
              {t("featured.badge")}
            </span>
          </div>
          <ProjectVisual
            seed="credit-risk-scoring"
            archetype="finance"
            className="aspect-video w-full rounded-xl border border-border"
          />
          <h3 className="mt-5 text-xl font-semibold text-fg">
            {t("featured.name")}
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted">{t("featured.desc")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TECH.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-fg-2"
              >
                {tech}
              </span>
            ))}
          </div>
          <Link
            href="/projects/credit-risk-scoring"
            className="group mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-sm text-accent-2"
          >
            {t("featured.cta")}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Card>

        {/* Latest post — indigo (real most-recent post) */}
        <Card accent="--accent1" item={item} className="lg:col-span-5 lg:row-span-2">
          <CardLabel>{t("latest.label")}</CardLabel>
          <h3 className="mt-4 text-lg font-semibold leading-snug text-fg">
            {latest?.title ?? t("latest.label")}
          </h3>
          {latest?.description ? (
            <p className="mt-2 text-sm text-muted">{latest.description}</p>
          ) : null}
          <Link
            href={latest ? `/blog/${latest.slug}` : "/blog"}
            className="group mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-sm text-accent-1"
          >
            {t("latest.cta")}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Card>

        {/* /now — amber */}
        <Card accent="--accent5" item={item} id="now" className="lg:col-span-5">
          <div className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full"
              style={{ background: "var(--accent5)" }}
            />
            <CardLabel>{t("now.label")}</CardLabel>
          </div>
          <ul className="mt-4 space-y-2.5">
            {nowItems.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-fg-2">
                <span aria-hidden style={{ color: "var(--accent5)" }}>
                  —
                </span>
                {line}
              </li>
            ))}
          </ul>
        </Card>

        {/* GitHub stats — teal */}
        <Card accent="--accent3" item={item} className="lg:col-span-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4" style={{ color: "var(--accent3)" }} />
            <CardLabel>{t("github.label")}</CardLabel>
          </div>
          <p
            className="mt-3 font-mono text-2xl font-semibold tabular-nums text-fg"
            style={{ color: "var(--accent3)" }}
          >
            <CountUp value={t("github.commits")} />
          </p>
          <ContribGrid />
          <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-xs text-muted">
            <span>{t("github.language")}</span>
            <span className="text-border">·</span>
            <span>{t("github.streak")}</span>
          </div>
        </Card>

        {/* Currently reading — magenta */}
        <Card accent="--accent4" item={item} className="lg:col-span-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4" style={{ color: "var(--accent4)" }} />
            <CardLabel>{t("reading.label")}</CardLabel>
          </div>
          <h3 className="mt-4 text-sm font-semibold leading-snug text-fg">
            {t("reading.title")}
          </h3>
          <p className="mt-1 text-xs text-muted">{t("reading.author")}</p>
          <div className="mt-auto pt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full"
                style={{ width: "62%", background: "var(--grad-divider)" }}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted">
              {t("reading.status")}
            </p>
          </div>
        </Card>

        {/* Connect — indigo */}
        <Card accent="--accent1" item={item} className="lg:col-span-4">
          <CardLabel>{t("connect.label")}</CardLabel>
          <div className="mt-4 flex flex-col gap-3">
            {CONNECT.map(({ Icon, href, handle }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-fg-2 transition-colors hover:text-accent-1"
              >
                <span className="grid size-8 place-items-center rounded-lg border border-border transition-colors group-hover:border-accent-1">
                  <Icon className="size-3.5" />
                </span>
                <span className="font-mono text-xs">{handle}</span>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
