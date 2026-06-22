"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide neon ribbon trails that flow toward the cursor (fixed, full-viewport,
 * behind the content). Spring-chained nodes draw soft additive glow; the hue
 * drifts through the site palette.
 *
 * Performance: the rAF loop runs ONLY while the cursor is moving or the ribbons
 * are still settling — when everything comes to rest it sleeps (zero idle cost),
 * and wakes on the next pointermove. Also paused when the tab is hidden, skipped
 * under prefers-reduced-motion, DPR-capped, and fully cleaned up.
 */
const TRAILS = 20;
const SIZE = 38;
const SPRING = 0.45;
const FRICTION = 0.5;
const DAMP = 0.025;
const TENSION = 0.99;

type Node = { x: number; y: number; vx: number; vy: number };
type Trail = { spring: number; nodes: Node[] };

export function CursorTrails() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    // Explicit non-null type so the rAF closure keeps the narrowing.
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pos = { x: W * 0.5, y: H * 0.4 };
    const target = { x: pos.x, y: pos.y };
    let lastPointer = -9999;

    const trails: Trail[] = [];
    for (let i = 0; i < TRAILS; i++) {
      const nodes: Node[] = [];
      for (let j = 0; j < SIZE; j++) nodes.push({ x: pos.x, y: pos.y, vx: 0, vy: 0 });
      trails.push({ spring: SPRING + (i / TRAILS) * 0.025, nodes });
    }

    let raf = 0;
    let alive = true;

    const ensureRunning = () => {
      if (alive && document.visibilityState !== "hidden" && !raf) {
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastPointer = performance.now();
      ensureRunning();
    };

    function frame(now: number) {
      raf = 0;
      if (!alive) return;

      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 5;
      const hue = 250 + 72 * Math.sin(now * 0.0003);
      ctx.strokeStyle = `hsla(${hue.toFixed(0)}, 92%, 62%, 0.035)`;

      let maxV = 0;
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
          const v = Math.abs(nd.vx) + Math.abs(nd.vy);
          if (v > maxV) maxV = v;
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

      // Keep going only while there's motion; otherwise sleep until the next move.
      const moving = maxV > 0.05 || now - lastPointer < 400;
      if (moving) raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        ensureRunning();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="cursor-trails" />;
}
