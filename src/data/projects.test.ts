import fs from "node:fs";
import path from "node:path";
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

  it("orders featured projects before the rest and locked projects last", () => {
    const sorted = sortedProjects();
    const featuredCount = projects.filter((p) => p.featured).length;
    const firstNonFeatured = sorted.findIndex((p) => !p.featured);
    expect(firstNonFeatured).toBe(featuredCount);

    const firstLocked = sorted.findIndex((p) => p.locked);
    const lastPublic = sorted.map((p) => !!p.locked).lastIndexOf(false);
    expect(firstLocked).toBeGreaterThan(lastPublic);
  });

  it("finds a project by slug and returns undefined for unknown slugs", () => {
    expect(getProject(projects[0].slug)?.slug).toBe(projects[0].slug);
    expect(getProject("does-not-exist")).toBeUndefined();
  });

  it("exposes tags that start with 'all' and contain no duplicates", () => {
    expect(projectTags[0]).toBe("all");
    expect(new Set(projectTags).size).toBe(projectTags.length);
  });

  it("uses only valid accent tokens", () => {
    for (const p of projects) {
      expect(p.accent).toMatch(/^--accent[1-5]$/);
    }
  });

  it("ships a real file for every declared cover image", () => {
    for (const p of projects) {
      if (!p.cover) continue;
      const file = path.join(process.cwd(), "public", p.cover);
      expect(fs.existsSync(file), `missing cover for ${p.slug}: ${p.cover}`).toBe(true);
    }
  });

  it("never exposes links, tech, or details for a locked project", () => {
    for (const p of projects.filter((x) => x.locked)) {
      expect(p.links.github).toBeUndefined();
      expect(p.links.demo).toBeUndefined();
      expect(p.tech).toHaveLength(0);
      expect(p.description).toBe("");
      expect(p.status).toBe("private");
    }
  });
});
