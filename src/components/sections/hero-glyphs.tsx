import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Ambient "computer engineering" glyph field behind the hero — binary, code
 * symbols and operators that gently twinkle and drift. Pure CSS (transform +
 * opacity only → compositor; no JS, no scroll coupling), masked to the right so
 * it never competes with the hero text, thinned out on mobile, and frozen under
 * prefers-reduced-motion. A Server Component (static markup).
 */
type Glyph = {
  c: string;
  top: string;
  left: string;
  size: number;
  color?: string;
  delay: number;
  dur: number;
  mobile?: boolean; // shown on small screens too (others are md+ only)
};

const GLYPHS: Glyph[] = [
  { c: "1 0 1 1", top: "12%", left: "60%", size: 15, delay: 0, dur: 4.2, mobile: true },
  { c: "</>", top: "19%", left: "86%", size: 20, color: "var(--accent3)", delay: 0.8, dur: 3.6, mobile: true },
  { c: "{ }", top: "9%", left: "40%", size: 13, delay: 1.6, dur: 5 },
  { c: "=>", top: "30%", left: "72%", size: 17, color: "var(--accent1)", delay: 2.2, dur: 4, mobile: true },
  { c: "0xFF", top: "40%", left: "89%", size: 13, delay: 0.5, dur: 4.6 },
  { c: "&&", top: "45%", left: "56%", size: 15, color: "var(--accent4)", delay: 1.1, dur: 3.8, mobile: true },
  { c: "λ", top: "53%", left: "82%", size: 22, color: "var(--accent5)", delay: 1.9, dur: 4.4, mobile: true },
  { c: "!=", top: "62%", left: "66%", size: 14, delay: 2.6, dur: 5.2 },
  { c: "0b1010", top: "70%", left: "88%", size: 13, delay: 0.7, dur: 4, mobile: true },
  { c: "::", top: "78%", left: "58%", size: 16, color: "var(--accent2)", delay: 1.4, dur: 3.6 },
  { c: "[ ]", top: "84%", left: "78%", size: 15, delay: 2.1, dur: 4.8, mobile: true },
  { c: "fn()", top: "36%", left: "91%", size: 13, delay: 3, dur: 4.2 },
  { c: "git", top: "88%", left: "44%", size: 12, delay: 0.9, dur: 5 },
  { c: "//", top: "26%", left: "50%", size: 13, delay: 1.7, dur: 4.4 },
  { c: "async", top: "58%", left: "34%", size: 12, delay: 2.4, dur: 5.2 },
  { c: "404", top: "14%", left: "74%", size: 14, color: "var(--accent4)", delay: 1.2, dur: 3.8, mobile: true },
  { c: "0 1", top: "48%", left: "91%", size: 18, delay: 0.4, dur: 4, mobile: true },
  { c: "( )", top: "72%", left: "48%", size: 14, delay: 1.8, dur: 4.6 },
  { c: "∑", top: "32%", left: "63%", size: 19, color: "var(--accent3)", delay: 2.7, dur: 4.2, mobile: true },
  { c: "npm", top: "66%", left: "76%", size: 13, delay: 0.6, dur: 5, mobile: true },
  { c: "1011", top: "90%", left: "68%", size: 14, delay: 1.5, dur: 4 },
  { c: "</body>", top: "22%", left: "30%", size: 12, delay: 2.9, dur: 5.4 },
];

export function HeroGlyphs() {
  return (
    <div aria-hidden className="hero-glyphs">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className={cn("hero-glyph", !g.mobile && "hidden md:inline")}
          style={
            {
              top: g.top,
              left: g.left,
              fontSize: `${g.size}px`,
              color: g.color ?? "var(--muted)",
              animation: `glyph-tw ${g.dur}s ease-in-out ${g.delay}s infinite, glyph-drift ${(g.dur * 1.6).toFixed(1)}s ease-in-out ${g.delay}s infinite alternate`,
            } as CSSProperties
          }
        >
          {g.c}
        </span>
      ))}
    </div>
  );
}
