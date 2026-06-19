"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";

const ITEMS = [
  "Python", "PyTorch", "LangChain", "FastAPI", "Next.js", "TypeScript",
  "XGBoost", "RAG", "scikit-learn", "Postgres", "Redis", "Docker",
  "Transformers", "Supabase", "Tailwind", "n8n",
];
const ACCENTS = ["--accent1", "--accent2", "--accent4", "--accent3", "--accent5"];
const NBSP = " ";
const SEP = NBSP + NBSP + NBSP + "•" + NBSP + NBSP + NBSP;

/**
 * A monospace marquee of the tools Metehan uses. Each glyph blooms to bold and
 * brightens exactly as it crosses the viewport centerline, then settles back —
 * driven by the variable-font `wght` axis. Monospace keeps advance width fixed,
 * so the weight animation causes zero reflow. Paused offscreen and for reduced
 * motion (where it renders as a static, evenly-weighted row).
 */
export function SkillsTicker() {
  const reduce = useReducedMotion();
  const stripRef = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => {
    const one: { ch: string; color: string }[] = [];
    ITEMS.forEach((item, wi) => {
      const color = `var(${ACCENTS[wi % ACCENTS.length]})`;
      for (const ch of item) one.push({ ch, color });
      for (const ch of SEP) one.push({ ch, color: "var(--muted)" });
    });
    return [...one, ...one]; // two copies → seamless translateX(-50%) loop
  }, []);

  useEffect(() => {
    if (reduce) return;
    const strip = stripRef.current;
    if (!strip) return;
    const spans = Array.from(strip.querySelectorAll<HTMLElement>("[data-c]"));
    const centers = spans.map((s) => s.offsetLeft + s.offsetWidth / 2);
    const last = new Array(spans.length).fill(-1);
    const R = 230; // focal radius around the centerline, px
    const frame = 1000 / 30;
    let prev = 0;
    let raf = 0;
    let running = true;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!running || now - prev < frame) return;
      prev = now;
      const left = strip.getBoundingClientRect().left;
      const cx = window.innerWidth / 2;
      for (let i = 0; i < spans.length; i++) {
        const d = Math.abs(left + centers[i] - cx);
        const e = d < R ? (1 - d / R) ** 2 : 0;
        const key = (e * 100) | 0;
        if (key !== last[i]) {
          last[i] = key;
          spans[i].style.fontVariationSettings = `'wght' ${360 + Math.round(e * 480)}`;
          spans[i].style.opacity = `${0.32 + e * 0.68}`;
        }
      }
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    io.observe(strip);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce, chars]);

  return (
    <section aria-label="Tools and technologies" className="border-y border-border/60 py-7">
      <div className="bloom-band">
        <div className="bloom-center" aria-hidden />
        <div ref={stripRef} className="bloom-strip text-lg md:text-xl">
          {chars.map((c, i) => (
            <span key={i} data-c style={{ color: c.color }}>
              {c.ch}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
