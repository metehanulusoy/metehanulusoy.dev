import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts, getPost } from "@/lib/posts";
import { routing } from "@/i18n/routing";
import { localizedUrl, SITE_URL } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { ViewCounter } from "@/components/view-counter";
import { Comments } from "@/components/comments";
import { CodeCopy } from "@/components/code-copy";

export function generateStaticParams() {
  // Posts are English-only, so prebuild just the default locale. /tr/blog/<slug>
  // still renders on demand (dynamicParams) with the same English content —
  // avoids compiling each post's MDX twice at build time.
  return getAllPosts().map((p) => ({ locale: routing.defaultLocale, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  const url = localizedUrl(locale, `/blog/${slug}`);
  const enUrl = `${SITE_URL}/blog/${slug}`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    // Posts are English-only, so don't advertise a `tr` hreflang equivalent that
    // would point at the same English content. Re-add `tr` once translations exist.
    alternates: {
      canonical: url,
      languages: { en: enUrl, "x-default": enUrl },
    },
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.description,
      url,
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = getPost(slug);
  if (!post) notFound();

  let body: ReactNode;
  try {
    const compiled = await compileMDX({
      source: post.content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              { theme: "github-dark-default", keepBackground: false },
            ],
          ],
        },
      },
    });
    body = compiled.content;
  } catch {
    body = (
      <p className="text-muted">
        This post couldn&apos;t be rendered. The source may be malformed.
      </p>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date || undefined,
    dateModified: post.meta.date || undefined,
    inLanguage: "en",
    keywords: post.meta.tags.join(", "),
    author: { "@type": "Person", name: "Metehan Ulusoy", url: SITE_URL },
    publisher: { "@type": "Person", name: "Metehan Ulusoy", url: SITE_URL },
    mainEntityOfPage: localizedUrl(locale, `/blog/${slug}`),
    image: `${SITE_URL}/opengraph-image`,
  };

  return (
    <article className="mx-auto max-w-2xl px-6 pt-36 pb-24 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        blog
      </Link>

      <Reveal className="mt-8">
        <p className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-4">
          <span>{post.meta.date}</span>
          <span className="text-muted">·</span>
          <span>
            {post.meta.minutes} {t("minRead")}
          </span>
          <ViewCounter slug={slug} label={t("views")} />
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.meta.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{post.meta.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-fg-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mdx mt-10">{body}</div>
      <CodeCopy />

      <div className="mt-16 border-t border-border pt-10">
        <Comments />
      </div>
    </article>
  );
}
