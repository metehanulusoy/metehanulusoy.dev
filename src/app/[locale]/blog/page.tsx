import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts } from "@/lib/posts";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { alternates, localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates(locale, "/blog"),
    openGraph: { url: localizedUrl(locale, "/blog") },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = getAllPosts(locale);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        tagline={t("tagline")}
        accent="--accent4"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <Reveal>
          {posts.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <ul className="border-y border-border">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-border last:border-b-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1 py-5 transition-transform duration-300 hover:translate-x-1 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <time className="w-24 shrink-0 font-mono text-xs text-muted">
                      {post.date}
                    </time>
                    <span className="flex-1">
                      <span className="text-base text-fg-2 transition-colors group-hover:text-fg">
                        <span className="u-grad pb-0.5">{post.title}</span>
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {post.description}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted">
                      {post.minutes} {t("minRead")}
                      <ArrowUpRight className="size-4 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </>
  );
}
