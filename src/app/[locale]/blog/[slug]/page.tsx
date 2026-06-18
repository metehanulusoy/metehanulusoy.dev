import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { setRequestLocale } from "next-intl/server";
import { getAllPosts, getPost } from "@/lib/posts";
import { getViews } from "@/lib/views";
import { routing } from "@/i18n/routing";
import { Reveal } from "@/components/reveal";
import { ViewCounter } from "@/components/view-counter";
import { Comments } from "@/components/comments";
import { CodeCopy } from "@/components/code-copy";

const SITE_URL = "https://metehanulusoy.dev";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPosts().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/blog/${slug}`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: url },
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

  const post = getPost(slug);
  if (!post) notFound();

  const views = await getViews(slug);

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

  return (
    <article className="mx-auto max-w-2xl px-6 pt-36 pb-24 md:px-8">
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
          <span>{post.meta.minutes} min read</span>
          {views !== null ? (
            <>
              <span className="text-muted">·</span>
              <span className="text-muted normal-case tracking-normal">
                <ViewCounter slug={slug} initial={views} />
              </span>
            </>
          ) : null}
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.meta.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{post.meta.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.meta.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-fg-2"
            >
              {t}
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
