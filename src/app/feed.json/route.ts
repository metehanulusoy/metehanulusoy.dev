import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

// Content is build-time only (MDX files), so prebuild the feed as a static file.
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Metehan Ulusoy",
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: "Notes on AI systems, LLM infrastructure, and the web.",
    language: "en",
    items: posts.map((p) => ({
      id: `${SITE_URL}/blog/${p.slug}`,
      url: `${SITE_URL}/blog/${p.slug}`,
      title: p.title,
      summary: p.description,
      tags: p.tags,
      ...(p.date ? { date_published: new Date(p.date).toISOString() } : {}),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
