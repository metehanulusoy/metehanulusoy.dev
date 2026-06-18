import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Now",
  description: "What Metehan Ulusoy is focused on right now.",
};

// ── Update this whenever your focus shifts (this is the point of a /now page) ──
const UPDATED = "June 2026";

const FOCUS = [
  "Building the software for a Teknofest 2026 project (İKA team).",
  "Coursework: operating systems, databases, and object-oriented programming.",
  "Applying to summer 2026 internships — backend, AI engineering, or FinTech.",
];

const NOT_DOING = [
  "Chasing every new framework — going deep on a few things instead.",
  "Side projects I can't finish in a weekend.",
];

export default function NowPage() {
  return (
    <>
      <PageHeader
        eyebrow="NOW"
        title="Now."
        tagline={`What I'm focused on this month. Last updated: ${UPDATED}.`}
        accent="--accent5"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-5">
            Focused on
          </h2>
          <ul className="mt-4 space-y-3">
            {FOCUS.map((item) => (
              <li key={item} className="flex gap-3 text-base text-fg-2">
                <span style={{ color: "var(--accent5)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Not doing right now
          </h2>
          <ul className="mt-4 space-y-3">
            {NOT_DOING.map((item) => (
              <li key={item} className="flex gap-3 text-base text-muted">
                <span>—</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <p className="font-mono text-xs text-muted">
            Inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-2 underline-offset-2 hover:underline"
            >
              Derek Sivers&apos; /now page
            </a>
            .
          </p>
        </Reveal>
      </div>
    </>
  );
}
