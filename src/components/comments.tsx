"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Announcements";
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
const configured = Boolean(repo && repoId && categoryId);

/**
 * Giscus loaded the canonical way (DOM-injected <script>), not via a React
 * <script> element — so React 19 never warns about scripts in render.
 * Renders nothing until the env vars are set.
 */
export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark_dimmed";

  useEffect(() => {
    const el = ref.current;
    if (!configured || !el) return;

    // Already loaded → just update the theme inside the iframe.
    const iframe = el.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app",
      );
      return;
    }

    // Script already injected but iframe still loading → don't double-inject.
    if (el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    const attrs: Record<string, string> = {
      "data-repo": repo!,
      "data-repo-id": repoId!,
      "data-category": category,
      "data-category-id": categoryId!,
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": theme,
      "data-lang": "en",
      "data-loading": "lazy",
    };
    for (const [k, v] of Object.entries(attrs)) script.setAttribute(k, v);
    el.appendChild(script);
  }, [theme]);

  if (!configured) return null;
  return <div ref={ref} className="giscus" />;
}
