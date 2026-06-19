"use client";

import { useEffect, useRef } from "react";

/* Fullscreen-triangle vertex shader. */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/* Domain-warped fbm — a slow, flowing aurora field tinted by the site's accents. */
const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;
uniform vec3 u_bg;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;
uniform vec3 u_c5;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;
  p *= 1.5;

  float t = u_time * 0.05;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.4 * t),
    fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.4 * t)
  );
  float f = fbm(p + 2.2 * r);

  vec3 col = u_bg;
  col += u_c1 * smoothstep(0.05, 0.70, f) * 1.05;
  col += u_c2 * smoothstep(0.20, 0.90, length(q) * 1.1) * 0.90;
  col += u_c3 * smoothstep(0.50, 1.00, r.x) * 0.85;
  col += u_c4 * smoothstep(0.32, 1.00, q.y * 1.1 + 0.28) * 0.75;
  col += u_c5 * smoothstep(0.82, 1.10, f) * 0.40;

  float vig = smoothstep(1.45, 0.20, length(uv - 0.5) * 1.25);
  col = mix(u_bg, col, 0.55 + 0.45 * vig);
  col = col / (1.0 + col * 0.30); // gentle highlight rolloff, avoids white clipping

  col = pow(max(col, 0.0), vec3(1.0 / 2.2)); // linear -> sRGB for display
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];

/** Read a CSS custom property as a linear-light RGB triple, via a resolved probe. */
function readAccents(host: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
  host.appendChild(probe);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const get = (name: string): RGB => {
    probe.style.color = `var(${name})`;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g);
    if (!m || m.length < 3) return [0, 0, 0];
    return [toLinear(+m[0]), toLinear(+m[1]), toLinear(+m[2])];
  };
  const out = {
    bg: get("--bg"),
    c1: get("--accent1"),
    c2: get("--accent2"),
    c3: get("--accent3"),
    c4: get("--accent4"),
    c5: get("--accent5"),
  };
  probe.remove();
  return out;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * A featherweight WebGL aurora that flows behind the page. Rendered at half
 * resolution (the field is soft, so it's cheap), capped at ~30fps, paused when
 * the tab is hidden, and re-tinted when the theme flips. Mounted only after the
 * page is idle and never for reduced-motion users — the CSS aurora is the poster.
 */
export function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false, depth: false }) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // no WebGL → CSS poster stays

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vert || !frag || !prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uniforms = {
      bg: gl.getUniformLocation(prog, "u_bg"),
      c1: gl.getUniformLocation(prog, "u_c1"),
      c2: gl.getUniformLocation(prog, "u_c2"),
      c3: gl.getUniformLocation(prog, "u_c3"),
      c4: gl.getUniformLocation(prog, "u_c4"),
      c5: gl.getUniformLocation(prog, "u_c5"),
    };

    const applyColors = () => {
      const c = readAccents(canvas.parentElement ?? document.body);
      gl.uniform3fv(uniforms.bg, c.bg);
      gl.uniform3fv(uniforms.c1, c.c1);
      gl.uniform3fv(uniforms.c2, c.c2);
      gl.uniform3fv(uniforms.c3, c.c3);
      gl.uniform3fv(uniforms.c4, c.c4);
      gl.uniform3fv(uniforms.c5, c.c5);
    };

    const SCALE = 0.5; // half-res backing store; softness hides it
    const resize = () => {
      const w = Math.max(2, Math.floor(window.innerWidth * SCALE));
      const h = Math.max(2, Math.floor(window.innerHeight * SCALE));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    applyColors();
    resize();

    const start = performance.now();
    const frame = 1000 / 30;
    let last = 0;
    let raf = 0;
    let shown = false;

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (document.hidden || now - last < frame) return;
      last = now;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("resize", resize, { passive: true });
    const themeObserver = new MutationObserver(applyColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      // NB: deliberately not calling WEBGL_lose_context here — under React's
      // dev StrictMode double-invoke, losing the context poisons the re-mount's
      // getContext() on the same canvas. This component lives in the root layout
      // and effectively never unmounts, so the context is freed by GC instead.
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out [filter:blur(14px)]"
    />
  );
}
