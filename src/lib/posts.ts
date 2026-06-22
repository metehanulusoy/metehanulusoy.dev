import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const DEFAULT_LOCALE = "en";

// Blog content is constant at build time, so memoize the parsed results in
// production (sitemap, RSS/JSON feeds, the blog list, generateStaticParams and
// the home page all read it). Disabled in dev so edits to MDX show on refresh.
const CACHE = process.env.NODE_ENV === "production";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  locale: string;
  minutes: number;
};

/** Word count excluding fenced code blocks, so code-heavy posts aren't over-counted. */
function readingMinutes(body: string): number {
  const prose = body.replace(/```[\s\S]*?```/g, " ");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Invalid/missing dates sort to the end rather than to an unstable position. */
function dateTime(date: string): number {
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? -Infinity : t;
}

function readMeta(
  data: Record<string, unknown>,
  slug: string,
  body: string,
): PostMeta {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: typeof data.category === "string" ? data.category : "notes",
    locale: typeof data.locale === "string" ? data.locale : DEFAULT_LOCALE,
    minutes: readingMinutes(body),
  };
}

let listCache: PostMeta[] | null = null;

function readAll(): PostMeta[] {
  if (CACHE && listCache) return listCache;
  const list = !fs.existsSync(BLOG_DIR)
    ? []
    : fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f): PostMeta | null => {
          try {
            const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
            const { data, content } = matter(raw);
            return readMeta(data, f.replace(/\.mdx$/, ""), content);
          } catch {
            // Skip a malformed post rather than crashing the whole list.
            return null;
          }
        })
        .filter((p): p is PostMeta => p !== null)
        .sort((a, b) => dateTime(b.date) - dateTime(a.date));
  if (CACHE) listCache = list;
  return list;
}

/**
 * Posts for a locale, newest first. If a locale has no posts of its own, falls
 * back to the full list (asymmetric content — /tr is never an empty page).
 */
export function getAllPosts(locale?: string): PostMeta[] {
  const all = readAll();
  if (!locale) return all;
  const forLocale = all.filter((p) => p.locale === locale);
  return forLocale.length > 0 ? forLocale : all;
}

/** Cheap, content-free existence check (no file read/parse). Used to validate
 *  attacker-controlled slugs in the public view-counter Server Action. */
export function postExists(slug: string): boolean {
  return readAll().some((p) => p.slug === slug);
}

const postCache = new Map<string, { meta: PostMeta; content: string } | null>();

export function getPost(
  slug: string,
): { meta: PostMeta; content: string } | null {
  if (CACHE && postCache.has(slug)) return postCache.get(slug)!;
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  let result: { meta: PostMeta; content: string } | null;
  try {
    result = fs.existsSync(file)
      ? (() => {
          const { data, content } = matter(fs.readFileSync(file, "utf8"));
          return { meta: readMeta(data, slug, content), content };
        })()
      : null;
  } catch {
    result = null;
  }
  if (CACHE) postCache.set(slug, result);
  return result;
}
