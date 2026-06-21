import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Bento } from "@/components/sections/bento";
import { SkillsTicker } from "@/components/sections/skills-ticker";
import { RecentWriting } from "@/components/sections/recent-writing";
import { getAllPosts } from "@/lib/posts";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const all = getAllPosts(locale);
  const posts = all.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    minutes: p.minutes,
  }));
  const latest = all[0]
    ? { slug: all[0].slug, title: all[0].title, description: all[0].description }
    : null;

  return (
    <>
      <Hero />
      <Bento latest={latest} />
      <SkillsTicker />
      <RecentWriting posts={posts} />
    </>
  );
}
