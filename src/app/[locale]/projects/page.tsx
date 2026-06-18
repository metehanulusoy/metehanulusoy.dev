import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things Metehan Ulusoy has built — AI systems, LLM infrastructure, and full-stack web apps.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="PROJECTS"
        title="Things I built."
        tagline="AI systems, LLM infrastructure, and the occasional full-stack web app — built, broken, and sometimes shipped."
        accent="--accent2"
      />
      <ProjectsExplorer />
    </>
  );
}
