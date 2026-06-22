"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cssColorToRgb } from "@/lib/css-rgb";
import { deferIdle } from "@/lib/defer";

/* Deterministic seed → repeatable per-project layout. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Blob = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  amplitude: number;
};

/**
 * A faint, single-hue living texture unique to each project — soft accent blobs
 * laid out deterministically from the slug, drawn once and only set in motion
 * while the card is hovered (so a grid of these stays essentially free). The
 * accent comes from the card's --card-accent; honors reduced motion (static).
 *
 * Init is lazy and idle-scheduled: a card only reads its accent colour, sizes its
 * canvas and paints once it scrolls near the viewport, and that work runs during
 * browser idle time — so opening a page with ~20 of these never piles a burst of
 * forced reflows onto one frame (the static gradient poster shows meanwhile).
 */
export function ProjectTexture({ seed, className }: { seed: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let r = 0;
    let g = 0;
    let b = 0;
    let blobs: Blob[] = [];
    let ready = false;
    let raf = 0;
    let resizeRaf = 0;
    let cancelInit = () => {};
    let alive = true;

    const resize = () => {
      canvas.width = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(2, Math.floor(canvas.clientHeight * dpr));
    };

    const draw = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const bl of blobs) {
        const cx = (bl.x + Math.cos(time * bl.speed + bl.phase) * bl.amplitude) * W;
        const cy = (bl.y + Math.sin(time * bl.speed * 0.8 + bl.phase) * bl.amplitude) * H;
        const radiusPx = bl.radius * Math.max(W, H);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radiusPx);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const card = canvas.closest<HTMLElement>(".aurora-card") ?? canvas;
    const start = performance.now();
    const frameMs = 1000 / 30;
    let lastT = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastT < frameMs) return;
      lastT = now;
      draw((now - start) / 1000);
    };
    const enter = () => {
      if (!ready || raf) return;
      lastT = 0;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      draw(0);
    };
    const onResize = () => {
      if (resizeRaf) return; // coalesce a resize-drag burst across N instances
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resize();
        draw(0);
      });
    };

    const init = () => {
      if (!alive || ready) return;
      // --card-accent resolves to an oklch() value; round-trip it through a
      // canvas to get true sRGB (a naive regex would read L/C/H as 0–255).
      [r, g, b] = cssColorToRgb(getComputedStyle(canvas).color);
      const rand = mulberry32(hash(seed));
      blobs = Array.from({ length: 3 + Math.floor(rand() * 2) }, () => ({
        x: 0.1 + rand() * 0.8,
        y: 0.1 + rand() * 0.8,
        radius: 0.28 + rand() * 0.4,
        phase: rand() * Math.PI * 2,
        speed: 0.25 + rand() * 0.5,
        amplitude: 0.03 + rand() * 0.05,
      }));
      resize();
      draw(0);
      ready = true;
      if (reduce) return;
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      window.addEventListener("resize", onResize, { passive: true });
    };

    // Init once the card is near the viewport, during idle time — so off-screen
    // cards cost nothing until scrolled to, and visible ones don't all reflow on
    // the same frame.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          cancelInit = deferIdle(init, 1500);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      alive = false;
      io.disconnect();
      cancelInit();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
    };
  }, [seed, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ color: "var(--card-accent, var(--accent2))" }}
    />
  );
}
