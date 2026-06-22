"use client";

import { useEffect, useRef } from "react";

/**
 * Neon ribbon trails that flow toward the cursor (adapted from a 21st.dev canvas
 * concept, reimplemented dependency-free). Spring-chained nodes draw soft glowing
 * curves with additive blending; the hue drifts through the site's vivid range.
 * Perf-guarded: paused offscreen via IntersectionObserver, skipped under
 * prefers-reduced-motion (the aurora shows through), auto-drifts when there's no
 * pointer (so it's alive on touch/idle), DPR capped, and fully cleaned up.
 */
const TRAILS = 22;
const SIZE = 40;
const SPRING = 0.45;
const FRICTION = 0.5;
const DAMP = 0.025;
const TENSION = 0.99;

type Node = { x: number; y: number; vx: number; vy: number };
type Trail = { spring: number; nodes: Node[] };

export function HeroTrails() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pos = { x: W * 0.6, y: H * 0.45 };
    const target = { x: pos.x, y: pos.y };
    let lastPointer = -9999;

    const trails: Trail[] = [];
    for (let i = 0; i < TRAILS; i++) {
      const nodes: Node[] = [];
      for (let j = 0; j < SIZE; j++) nodes.push({ x: pos.x, y: pos.y, vx: 0, vy: 0 });
      trails.push({ spring: SPRING + (i / TRAILS) * 0.025, nodes });
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      lastPointer = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let visible = true;
    let alive = true;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!alive || !visible) return;

      // No recent pointer → drift the attractor so it stays alive (mobile/idle).
      if (now - lastPointer > 2200) {
        const tt = (now - t0) / 1000;
        target.x = W * (0.5 + 0.33 * Math.sin(tt * 0.45));
        target.y = H * (0.5 + 0.3 * Math.sin(tt * 0.63 + 1));
      }
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 6;
      const hue = 250 + 72 * Math.sin(now * 0.0003);
      ctx.strokeStyle = `hsla(${hue.toFixed(0)}, 92%, 62%, 0.035)`;

      for (const tr of trails) {
        let e = tr.spring;
        const head = tr.nodes[0];
        head.vx += (pos.x - head.x) * e;
        head.vy += (pos.y - head.y) * e;
        for (let i = 0; i < tr.nodes.length; i++) {
          const nd = tr.nodes[i];
          if (i > 0) {
            const pr = tr.nodes[i - 1];
            nd.vx += (pr.x - nd.x) * e;
            nd.vy += (pr.y - nd.y) * e;
            nd.vx += pr.vx * DAMP;
            nd.vy += pr.vy * DAMP;
          }
          nd.vx *= FRICTION;
          nd.vy *= FRICTION;
          nd.x += nd.vx;
          nd.y += nd.vy;
          e *= TENSION;
        }
        ctx.beginPath();
        ctx.moveTo(tr.nodes[0].x, tr.nodes[0].y);
        let i = 1;
        for (; i < tr.nodes.length - 2; i++) {
          const a = tr.nodes[i];
          const b = tr.nodes[i + 1];
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
        }
        const a = tr.nodes[i];
        const b = tr.nodes[i + 1];
        if (a && b) ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && alive && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="hero-canvas" />;
}
