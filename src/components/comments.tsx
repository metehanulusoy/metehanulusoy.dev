"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "General";
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

/** Renders nothing until the Giscus env vars (from giscus.app) are set. */
export function Comments() {
  const { resolvedTheme } = useTheme();

  if (!repo || !repoId || !categoryId) return null;

  return (
    <Giscus
      repo={repo}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === "light" ? "light" : "dark_dimmed"}
      lang="en"
      loading="lazy"
    />
  );
}
