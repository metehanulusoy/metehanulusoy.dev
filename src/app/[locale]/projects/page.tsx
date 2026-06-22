import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { GalaxyBackdrop } from "@/components/sections/galaxy-backdrop";
import { alternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates(locale, "/projects"),
    openGraph: { url: localizedUrl(locale, "/projects") },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <>
      <GalaxyBackdrop />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        tagline={t("tagline")}
        accent="--accent2"
      />
      <ProjectsExplorer />
    </>
  );
}
