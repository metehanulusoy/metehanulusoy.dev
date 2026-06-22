"use client";

import { useEffect, useRef } from "react";
import { deferIdle } from "@/lib/defer";

/**
 * Neon vortex backdrop (concept #2) — hue-shifting particles orbit the center and
 * brighten near a "source" that follows the cursor (auto-orbits when idle).
 * Additive blending gives the glow. Scoped to whichever page renders it.
 * Perf-guarded: DPR capped, paused when the tab is hidden, skipped under
 * prefers-reduced-motion / no 2D context, cleaned up on unmount. The heavy init
 * (buffer + particle build + first rAF) is deferred one frame so it never lands
 * on the route-transition frame.
 */
type P = { dist: number; rad: number; bs: number; vs: number; size: number };

export function VortexBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let span = 0;
    let ps: P[] = [];
    let raf = 0;
    let cancelInit = () => {};
    let alive = true;
    let tick = 0;
    let srad = 0;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      span = Math.min(canvas.width, canvas.height);
    };

    const src = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastPointer = -9999;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX * dpr - canvas.width / 2;
      target.y = e.clientY * dpr - canvas.height / 2;
      lastPointer = performance.now();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive || document.hidden) return;
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      if (now - lastPointer > 2000) {
        srad += 0.01;
        const sd = span * 0.18 + Math.sin(srad * 1.3) * span * 0.1;
        target.x = sd * Math.cos(srad);
        target.y = sd * Math.sin(srad);
      }
      src.x += (target.x - src.x) * 0.06;
      src.y += (target.y - src.y) * 0.06;

      for (const p of ps) {
        p.rad += p.bs + p.vs * Math.sin(p.rad * 7 + tick / 100);
        const x = p.dist * Math.cos(p.rad);
        const y = p.dist * Math.sin(p.rad);
        const sq = (x - src.x) * (x - src.x) + (y - src.y) * (y - src.y);
        const sp = Math.sqrt(span) / Math.sqrt(sq + 1);
        const hue = (((p.rad / 6.283) * 360 + tick) % 360 + 360) % 360;
        ctx.fillStyle = `hsla(${hue.toFixed(0)}, 85%, ${(7 + sp * 28).toFixed(0)}%, 0.82)`;
        ctx.beginPath();
        ctx.arc(x, y, Math.min(p.size * sp, 5 * dpr), 0, 6.283);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
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
      ps = Array.from({ length: 70 }, () => ({
        dist: Math.sqrt(Math.random()) * (span / 2),
        rad: Math.random() * 6.283,
        bs: 0.001 + 0.001 * Math.random(),
        vs: 0.0005 + 0.0005 * Math.random(),
        size: (2 + 2 * Math.random()) * dpr,
      }));
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      alive = false;
      cancelInit();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="page-backdrop" />;
}
