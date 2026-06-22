"use client";

import type { PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useSpring } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { heroContainer, heroItem } from "@/lib/motion";
import { useMotionVariants } from "@/lib/use-motion-variants";
import { DecryptText } from "@/components/decrypt-text";
import { HeroDots } from "@/components/sections/hero-dots";

export function Hero() {
  const t = useTranslations("hero");
  const { reduce, container, item } = useMotionVariants(heroContainer, heroItem);
  const words = t("name").split(" ");

  const magnetX = useSpring(0, { stiffness: 300, damping: 22 });
  const magnetY = useSpring(0, { stiffness: 300, damping: 22 });
  const onMagnet = (e: PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    magnetX.set((e.clientX - r.left - r.width / 2) * 0.4);
    magnetY.set((e.clientY - r.top - r.height / 2) * 0.4);
  };
  const resetMagnet = () => {
    magnetX.set(0);
    magnetY.set(0);
  };

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 pt-28 pb-20 md:px-8"
    >
      <HeroDots />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl"
      >
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 backdrop-blur-md"
        >
          <span
            className="status-dot size-2 rounded-full"
            style={{ background: "var(--accent3)" }}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-fg-2">
            {t("available")}
          </span>
        </motion.div>

        <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight">
          {words.map((word, i) => (
            <motion.span key={i} variants={item} className="text-gradient inline-block">
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg text-muted md:text-xl"
        >
          {t("tagline")}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <motion.span
            onPointerMove={onMagnet}
            onPointerLeave={resetMagnet}
            style={reduce ? undefined : { x: magnetX, y: magnetY }}
            className="inline-flex"
          >
            <motion.a
              href="#writing"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="sheen inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: "var(--grad-cta)" }}
            >
              {t("readBlog")} <ArrowRight className="size-4" />
            </motion.a>
          </motion.span>
          <Link
            href="/projects"
            className="inline-flex items-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-fg backdrop-blur-md transition-colors hover:border-accent-1"
          >
            {t("seeProjects")}
          </Link>
          <a
            href="/cv.pdf"
            className="group inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-fg-2 transition-colors hover:text-fg"
          >
            <Download className="size-4" />
            <span className="u-grad pb-0.5">{t("downloadCV")}</span>
          </a>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-10 font-mono text-sm text-muted"
        >
          <span className="text-accent-3">metehan@dev</span>:
          <span className="text-accent-1">~</span>${" "}
          <DecryptText text={t("learning")} />
          <span className="caret ml-0.5 inline-block text-accent-5">▋</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
