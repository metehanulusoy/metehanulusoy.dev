import type { Metadata } from "next";
import { Download, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { VortexBackdrop } from "@/components/sections/vortex-backdrop";
import { alternates, localizedUrl } from "@/lib/seo";

type Timeline = { period: string; title: string; detail: string; note: string };
type SkillCol = { heading: string; items: string[] };

const FACT_ICONS = [MapPin, GraduationCap, Sparkles] as const;
const FACT_KEYS = ["location", "education", "current"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates(locale, "/about"),
    openGraph: { url: localizedUrl(locale, "/about") },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const bio = t.raw("bio") as string[];
  const timeline = t.raw("timeline") as Timeline[];
  const skills = t.raw("skills") as SkillCol[];

  return (
    <>
      <VortexBackdrop />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        tagline={t("tagline")}
        accent="--accent1"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <Reveal>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
            {FACT_KEYS.map((key, i) => {
              const Icon = FACT_ICONS[i];
              return (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <Icon className="size-3.5" style={{ color: "var(--accent3)" }} />
                  {t(`facts.${key}`)}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-10 space-y-4 text-base leading-relaxed text-fg-2">
          {bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">
            {t("educationHeading")}
          </h2>
          <ul className="timeline mt-5 space-y-7">
            {timeline.map((entry) => (
              <li key={entry.title} className="timeline-item">
                <span className="timeline-dot" aria-hidden />
                <span className="font-mono text-xs text-muted">{entry.period}</span>
                <p className="mt-1 font-medium text-fg">{entry.title}</p>
                <p className="text-sm text-muted">{entry.detail}</p>
                <p className="mt-1 text-sm text-muted">{entry.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">
            {t("skillsHeading")}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {skills.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {col.heading}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {col.items.map((s) => (
                    <li key={s} className="text-sm text-fg-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-muted">{t("languagesLine")}</p>
        </Reveal>

        <Reveal className="mt-14">
          <a
            href="/cv.pdf"
            className="group inline-flex items-center gap-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg"
          >
            <Download className="size-4" />
            <span className="u-grad pb-0.5">{t("downloadCV")}</span>
          </a>
        </Reveal>
      </div>
    </>
  );
}
