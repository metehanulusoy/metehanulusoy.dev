"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-#*";
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/** "Decrypts" the text left-to-right (scramble → settle) when it scrolls in. */
export function DecryptText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce || !inView) return;
    let revealed = 0;
    let count = 0;
    let raf = 0;
    const tick = () => {
      count += 1;
      if (count % 2 === 0) revealed += 1;
      setDisplay(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < revealed ? ch : rand()))
          .join(""),
      );
      if (revealed <= text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  // Screen readers get the clean text; the scrambling glyphs are decorative.
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className={className}>
        {display}
      </span>
    </>
  );
}
