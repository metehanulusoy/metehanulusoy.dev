"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

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
    let running = false;

    const tick = (now: number) => {
      raf = 0;
      if (!running) return;
      if (now - prev >= frame) {
        prev = now;
        const left = strip.getBoundingClientRect().left;
        const cx = window.innerWidth / 2;
        for (let i = 0; i < spans.length; i++) {
          const distance = Math.abs(left + centers[i] - cx);
          const intensity = distance < R ? (1 - distance / R) ** 2 : 0; // eased falloff
          const bucket = (intensity * 100) | 0; // quantize → skip redundant style writes
          if (bucket !== last[i]) {
            last[i] = bucket;
            spans[i].style.fontVariationSettings = `'wght' ${360 + Math.round(intensity * 480)}`;
            // Resting glyphs stay legible (≥4.5:1); the bloom is carried by weight,
            // not by dimming text below contrast.
            spans[i].style.opacity = `${0.85 + intensity * 0.15}`;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const ensureRunning = () => {
      if (running && !raf) raf = requestAnimationFrame(tick);
    };

    // Only run the per-glyph loop while the strip is on screen; fully sleep the
    // rAF (no empty wake-ups) when it scrolls out of view.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      // Also halt the CSS marquee transform so it stops compositing offscreen.
      strip.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      if (running) ensureRunning();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(strip);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      strip.style.animationPlayState = "";
    };
  }, [reduce, chars]);

  return (
    <section aria-label="Tools and technologies" className="border-y border-border/60 py-7">
      {/* The marquee is decorative (two duplicated, per-glyph copies); expose the
          skills to assistive tech once, as plain text. */}
      <ul className="sr-only">
        {ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="bloom-band" aria-hidden>
        <div className="bloom-center" />
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
