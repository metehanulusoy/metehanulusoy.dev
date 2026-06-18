import { describe, it, expect } from "vitest";
import { getAllPosts, getPost } from "@/lib/posts";

describe("posts", () => {
  const posts = getAllPosts();

  it("loads the MDX posts from content/blog", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("sorts posts by date, newest first", () => {
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime(),
      );
    }
  });

  it("computes a reading time of at least one minute", () => {
    expect(posts.every((p) => p.minutes >= 1)).toBe(true);
  });

  it("returns null for a missing slug", () => {
    expect(getPost("not-a-real-post")).toBeNull();
  });

  it("returns content for a real slug", () => {
    const post = getPost(posts[0].slug);
    expect(post?.content.length).toBeGreaterThan(0);
  });
});
