"use client";

import { useEffect, useRef } from "react";
import { deferIdle } from "@/lib/defer";

/**
 * Meteor shower backdrop (concept #3) — a faint twinkling starfield with periodic
 * shooting-star streaks. Scoped to whichever page renders it. Perf-guarded: DPR
 * capped, paused when the tab is hidden, skipped under prefers-reduced-motion /
 * no 2D context, cleaned up on unmount. The heavy init (buffer + starfield build
 * + first rAF) is deferred one frame so it never lands on the route-transition
 * frame; resize only re-seeds the field when the dimensions actually change.
 */
type Star = { x: number; y: number; r: number; tw: number };
type Meteor = { x: number; y: number; len: number; sp: number; life: number };

export function MeteorsBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let last = 0;
    let raf = 0;
    let cancelInit = () => {};
    let alive = true;

    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      // Skip no-op resize events: only re-seed when the size truly changes.
      if (canvas.width === w && canvas.height === h && stars.length) return;
      canvas.width = w;
      canvas.height = h;
      stars = Array.from({ length: 44 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 * dpr + 0.3,
        tw: Math.random() * 6.283,
      }));
    };

    const frame = (t: number) => {
      raf = 0;
      if (!alive || document.hidden) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const a = 0.3 + 0.3 * Math.sin(t * 0.001 + s.tw);
        ctx.fillStyle = `rgba(202,207,236,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }

      if (t - last > 620) {
        last = t;
        meteors.push({
          x: Math.random() * canvas.width,
          y: -20 * dpr,
          len: (50 + Math.random() * 60) * dpr,
          sp: (3.5 + Math.random() * 3) * dpr,
          life: 1,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x -= m.sp * 0.5;
        m.y += m.sp;
        m.life -= 0.0045;
        const g = ctx.createLinearGradient(m.x, m.y, m.x + m.len * 0.5, m.y - m.len);
        const a = Math.max(0, m.life);
        g.addColorStop(0, `rgba(62,214,200,${a})`);
        g.addColorStop(1, "rgba(123,120,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.len * 0.5, m.y - m.len);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.arc(m.x, m.y, 1.6 * dpr, 0, 6.283);
        ctx.fill();
        if (m.y > canvas.height + 40 * dpr || m.life <= 0) meteors.splice(i, 1);
      }
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

    cancelInit = deferIdle(() => {
      if (!alive) return;
      resize();
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      alive = false;
      cancelInit();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="page-backdrop" />;
}
