import { Hero } from "@/components/sections/hero";
import { Bento } from "@/components/sections/bento";
import { RecentWriting } from "@/components/sections/recent-writing";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      minutes: p.minutes,
    }));

  return (
    <>
      <Hero />
      <Bento />
      <RecentWriting posts={posts} />
    </>
  );
}
