import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Entry[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/now", priority: 0.6, changeFrequency: "monthly" },
  ];

  const projectPages: Entry[] = projects
    .filter((p) => !p.locked) // private projects have no public URL
    .map((p) => ({
      path: `/projects/${p.slug}`,
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: `${p.year}-01-01`,
    }));

  const postPages: Entry[] = getAllPosts().map((p) => ({
    path: `/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: p.date || undefined,
  }));

  return [...staticPages, ...projectPages, ...postPages].map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    // Declare the en/tr equivalence inline (the canonical bilingual sitemap form).
    alternates: {
      languages: {
        en: `${SITE_URL}${entry.path}`,
        tr: `${SITE_URL}/tr${entry.path}`,
      },
    },
  }));
}
