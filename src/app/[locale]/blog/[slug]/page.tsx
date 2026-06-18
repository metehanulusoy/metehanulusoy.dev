import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost } from "@/lib/posts";
import { getViews } from "@/lib/views";
import { Reveal } from "@/components/reveal";
import { ViewCounter } from "@/components/view-counter";
import { Comments } from "@/components/comments";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.meta.title, description: post.meta.description };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const views = await getViews(slug);

  const { content } = await compileMDX({
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

      <div className="mdx mt-10">{content}</div>

      <div className="mt-16 border-t border-border pt-10">
        <Comments />
      </div>
    </article>
  );
}
