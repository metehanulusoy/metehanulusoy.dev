import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/data/projects";

const SITE_URL = "https://metehanulusoy.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/projects", "/blog", "/about", "/now"];
  const dynamicPaths = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...getAllPosts().map((p) => `/blog/${p.slug}`),
  ];
  const paths = [...staticPaths, ...dynamicPaths];

  return routing.locales.flatMap((locale) => {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return paths.map((path) => ({
      url: `${SITE_URL}${prefix}${path}`,
      changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path.includes("/", 1) ? 0.7 : 0.8,
    }));
  });
}
