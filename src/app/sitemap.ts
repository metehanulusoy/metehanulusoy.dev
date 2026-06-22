import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
  localized: boolean;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Entry[] = [
    { path: "", priority: 1, changeFrequency: "weekly", localized: true },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly", localized: true },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly", localized: true },
    { path: "/about", priority: 0.6, changeFrequency: "monthly", localized: true },
    { path: "/now", priority: 0.6, changeFrequency: "monthly", localized: true },
  ];

  const projectPages: Entry[] = projects
    .filter((p) => !p.locked) // private projects have no public URL
    .map((p) => ({
      path: `/projects/${p.slug}`,
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: `${p.year}-01-01`,
      localized: true,
    }));

  // Posts are English-only; their blog/[slug] metadata deliberately omits the tr
  // hreflang, so the sitemap must not advertise a /tr alternate for them.
  const postPages: Entry[] = getAllPosts().map((p) => ({
    path: `/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: p.date || undefined,
    localized: false,
  }));

  return [...staticPages, ...projectPages, ...postPages].map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: {
      languages: entry.localized
        ? { en: `${SITE_URL}${entry.path}`, tr: `${SITE_URL}/tr${entry.path}` }
        : { en: `${SITE_URL}${entry.path}` },
    },
  }));
}
