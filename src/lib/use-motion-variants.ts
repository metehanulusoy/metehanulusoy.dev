"use client";

import { type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { noOpContainer, reducedItem } from "@/lib/motion";

/**
 * Selects full or reduced-motion variants once, based on the user's
 * `prefers-reduced-motion` setting. Centralizes the pattern that was
 * duplicated across every animated section.
 */
export function useMotionVariants(container: Variants, item: Variants) {
  const reduce = useReducedMotion();
  return {
    reduce: Boolean(reduce),
    container: reduce ? noOpContainer : container,
    item: reduce ? reducedItem : item,
  };
}
