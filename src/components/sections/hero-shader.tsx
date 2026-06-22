"use client";

import { useEffect, useRef } from "react";

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

// Flowing plasma, tinted with the site accents. Right-weighted + edge-faded via
// the output alpha, so it blends with the aurora behind and never hurts the
// hero text on the left.
const FRAG = `precision highp float;
uniform vec2 R;uniform float T;
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  vec2 p=uv*2.0-1.0;p.x*=R.x/R.y;
  float t=T*0.14;
  float v=0.0;
  v+=sin(p.x*2.0+t);
  v+=sin((p.y*2.5+t)*1.2);
  v+=sin((p.x*1.5+p.y*1.5+t)*0.8);
  vec2 q=p+0.45*vec2(sin(t+p.y*1.6),cos(t*0.9+p.x*1.6));
  v+=sin(length(q)*3.0-t*1.4);
  v*=0.25;
  vec3 a=vec3(0.42,0.40,1.0),b=vec3(0.63,0.36,0.96),cc=vec3(0.24,0.84,0.78),d=vec3(1.0,0.37,0.68);
  vec3 col=mix(a,b,0.5+0.5*sin(v*3.14159));
  col=mix(col,cc,0.5+0.5*sin(v*3.14159+2.0));
  col=mix(col,d,0.5+0.5*sin(length(q)*2.0-t));
  col*=0.85;
  float right=smoothstep(0.05,0.72,uv.x);
  float edge=smoothstep(0.0,0.16,uv.y)*smoothstep(1.0,0.84,uv.y);
  float al=right*edge*0.92;
  gl_FragColor=vec4(col*al,al);
}`;

/**
 * Real-time WebGL plasma behind the hero — the GPU "wow" layer. Raw WebGL (no
 * dependency). Perf-guarded: GPU-bound (not main thread), DPR capped at 1.5,
 * paused offscreen via IntersectionObserver, skipped under prefers-reduced-motion
 * and on context loss / no WebGL (the global aurora then shows through).
 */
export function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const vsh = compile(gl.VERTEX_SHADER, VERT);
    const fsh = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vsh || !fsh || !prog) return;
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, "R");
    const uT = gl.getUniformLocation(prog, "T");

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * d);
      const h = Math.floor(canvas.clientHeight * d);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    let raf = 0;
    let visible = true;
    let alive = true;
    const start = performance.now();

    const frame = () => {
      raf = 0;
      if (!alive || !visible) return;
      resize();
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && alive && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    const onLost = (e: Event) => {
      e.preventDefault();
      alive = false;
      if (raf) cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="hero-shader" />;
}
