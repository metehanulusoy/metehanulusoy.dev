"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

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

/**
 * A faint, single-hue living texture unique to each project — soft accent blobs
 * laid out deterministically from the slug, drawn once and only set in motion
 * while the card is hovered (so a grid of these stays essentially free). The
 * accent comes from the card's --card-accent; honors reduced motion (static).
 */
export function ProjectTexture({ seed, className }: { seed: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const m = getComputedStyle(canvas).color.match(/[\d.]+/g);
    const [r, g, b] = m && m.length >= 3 ? m.map(Number) : [150, 130, 240];

    const rand = mulberry32(hash(seed));
    const blobs = Array.from({ length: 3 + Math.floor(rand() * 2) }, () => ({
      x: 0.1 + rand() * 0.8,
      y: 0.1 + rand() * 0.8,
      rad: 0.28 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      spd: 0.25 + rand() * 0.5,
      amp: 0.03 + rand() * 0.05,
    }));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
        const cx = (bl.x + Math.cos(time * bl.spd + bl.phase) * bl.amp) * W;
        const cy = (bl.y + Math.sin(time * bl.spd * 0.8 + bl.phase) * bl.amp) * H;
        const rr = bl.rad * Math.max(W, H);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    draw(0);
    if (reduce) return;

    const card = canvas.closest<HTMLElement>(".aurora-card") ?? canvas;
    const start = performance.now();
    const frameMs = 1000 / 30;
    let raf = 0;
    let lastT = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastT < frameMs) return;
      lastT = now;
      draw((now - start) / 1000);
    };
    const enter = () => {
      if (!raf) {
        lastT = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      draw(0);
    };
    const onResize = () => {
      resize();
      draw(0);
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
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
