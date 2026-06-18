"use client";

import { useEffect, useState } from "react";
import { incrementView } from "@/lib/views";

export function ViewCounter({ slug, initial }: { slug: string; initial: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let active = true;
    incrementView(slug).then((next) => {
      if (active && typeof next === "number") setCount(next);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return <span>{count.toLocaleString()} views</span>;
}
