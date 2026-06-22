import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { MeteorsBackdrop } from "@/components/sections/meteors-backdrop";
import { alternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "now" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates(locale, "/now"),
    openGraph: { url: localizedUrl(locale, "/now") },
  };
}

export default async function NowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("now");

  const focus = t.raw("focus") as string[];
  const notDoing = t.raw("notDoing") as string[];

  return (
    <>
      <MeteorsBackdrop />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        tagline={t("tagline", { updated: t("updated") })}
        accent="--accent5"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-5">
            {t("focusedHeading")}
          </h2>
          <ul className="mt-4 space-y-3">
            {focus.map((item) => (
              <li key={item} className="flex gap-3 text-base text-fg-2">
                <span style={{ color: "var(--accent5)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            {t("notDoingHeading")}
          </h2>
          <ul className="mt-4 space-y-3">
            {notDoing.map((item) => (
              <li key={item} className="flex gap-3 text-base text-muted">
                <span>—</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <p className="font-mono text-xs text-muted">
            {t("inspiredPre")}{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-2 underline-offset-2 hover:underline"
            >
              {t("inspiredLink")}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </>
  );
}
