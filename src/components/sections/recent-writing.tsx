"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cardContainer, cardItem, reducedItem, sectionReveal } from "@/lib/motion";
import { useMotionVariants } from "@/lib/use-motion-variants";

type Post = { slug: string; title: string; date: string; minutes: number };

export function RecentWriting({ posts }: { posts: Post[] }) {
  const t = useTranslations("writing");
  const { reduce, container, item } = useMotionVariants(cardContainer, cardItem);

  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:px-8"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={reduce ? reducedItem : sectionReveal}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent-4">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {t("title")}
        </h2>
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={container}
        className="mt-10 border-y border-border"
      >
        {posts.map((post) => (
          <motion.li
            key={post.slug}
            variants={item}
            className="border-b border-border last:border-b-0"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative flex items-center gap-4 py-5 pl-4 transition-transform duration-300 hover:translate-x-1"
            >
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full transition-all duration-300 group-hover:h-3/5"
                style={{ background: "var(--grad-divider)" }}
              />
              <time className="w-24 shrink-0 font-mono text-xs text-muted">
                {post.date}
              </time>
              <span className="flex-1 text-base text-fg-2 transition-colors group-hover:text-fg">
                <span className="u-grad pb-0.5">{post.title}</span>
              </span>
              <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">
                {post.minutes} {t("minRead")}
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-4" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-8">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-mono text-sm text-accent-1 transition-colors hover:text-accent-2"
        >
          {t("all")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
