"use client";

import { useEffect, useState } from "react";
import { incrementView } from "@/lib/views";

/**
 * Client-only view counter so the blog post itself stays statically generated.
 * Renders nothing until a real count arrives (and stays hidden when Redis isn't
 * configured / the action returns null), so a post never shows a stale "0 views".
 */
export function ViewCounter({ slug, label }: { slug: string; label: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    incrementView(slug)
      .then((next) => {
        if (active && typeof next === "number") setCount(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  if (count === null) return null;

  return (
    <>
      <span className="text-muted">·</span>
      <span className="text-muted normal-case tracking-normal">
        {count.toLocaleString()} {label}
      </span>
    </>
  );
}
