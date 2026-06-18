import { describe, it, expect } from "vitest";
import {
  projects,
  projectTags,
  getProject,
  sortedProjects,
} from "@/data/projects";

describe("projects data", () => {
  it("has a unique slug for every project", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("orders featured projects before the rest", () => {
    const sorted = sortedProjects();
    const featuredCount = projects.filter((p) => p.featured).length;
    const firstNonFeatured = sorted.findIndex((p) => !p.featured);
    expect(firstNonFeatured).toBe(featuredCount);
  });

  it("finds a project by slug and returns undefined for unknown slugs", () => {
    expect(getProject(projects[0].slug)?.slug).toBe(projects[0].slug);
    expect(getProject("does-not-exist")).toBeUndefined();
  });

  it("exposes tags that start with 'all' and contain no duplicates", () => {
    expect(projectTags[0]).toBe("all");
    expect(new Set(projectTags).size).toBe(projectTags.length);
  });
});
