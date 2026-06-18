import type { Variants } from "motion/react";

/** Shared easing curves (match the CSS motion tokens in globals.css). */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hero: per-word staggered reveal. */
export const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: "0.5em", clipPath: "inset(100% 0 0 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 0.52, ease: easeOutQuart },
  },
};

/** Sections: fade + rise on scroll into view. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.54, ease: easeOutExpo } },
};

/** Bento grid: stagger children. */
export const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

/** Reduced-motion fallbacks (no stagger / movement, opacity only). */
export const noOpContainer: Variants = { hidden: {}, show: {} };
export const reducedItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};
