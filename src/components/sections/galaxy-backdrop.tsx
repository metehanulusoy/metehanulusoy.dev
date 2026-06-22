"use client";

import { useEffect, useRef } from "react";

/**
 * Galaxy particle backdrop (concept #1) — orbiting, radiating star dust on a
 * fixed full-viewport canvas. Scoped to whichever page renders it (mounts/unmounts
 * with the route). Perf-guarded: DPR capped, paused when the tab is hidden,
 * skipped under prefers-reduced-motion / no 2D context, and fully cleaned up.
 */
type Star = { ring: number; rad: number; radius: number; move: number; col: string };

export function GalaxyBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let R = 0;
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      R = Math.min(canvas.width, canvas.height) * 0.16;
    };
    resize();

    const cols = ["rgba(62,214,200,", "rgba(123,120,255,", "rgba(225,228,255,"];
    const stars: Star[] = Array.from({ length: 130 }, () => ({
      ring: Math.random() * R * 3,
      rad: Math.random() * 7,
      radius: Math.random() * 2.2 * dpr,
      move: (Math.random() * 4 + 1) / 700,
      col: cols[(Math.random() * cols.length) | 0],
    }));

    let raf = 0;
    let alive = true;
    const frame = () => {
      raf = 0;
      if (!alive || document.hidden) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      for (const p of stars) {
        p.ring = Math.max(p.ring - 0.5 * dpr, R);
        p.rad += p.move;
        p.radius *= 0.993;
        if (p.radius < 0.5 * dpr) {
          p.ring = Math.random() * R * 3;
          p.radius = Math.random() * 2.2 * dpr;
        }
        ctx.beginPath();
        ctx.fillStyle = `${p.col}0.8)`;
        ctx.arc(Math.cos(p.rad) * p.ring, Math.sin(p.rad) * p.ring, p.radius, 0, 6.283);
        ctx.fill();
      }
      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (alive && !raf) {
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="page-backdrop" />;
}
