"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const word: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
const reducedWord: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * A heading that reveals word-by-word. By default it triggers on scroll-into-view;
 * pass `immediate` for above-the-fold titles so the stagger starts on the first
 * frame (no blank title while the IntersectionObserver settles after a route
 * change). Variants, stagger and easing are identical either way.
 */
export function RevealText({
  text,
  className,
  as = "h2",
  immediate = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Tag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;

  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "-12% 0px" } };

  return (
    <Tag
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${i}-${w}`}
          className="inline-block"
          variants={reduce ? reducedWord : word}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
