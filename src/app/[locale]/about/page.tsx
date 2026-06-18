import type { Metadata } from "next";
import { Download, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Metehan Ulusoy — Computer Engineering student building AI, automation, and full-stack projects.",
};

const QUICK_FACTS = [
  { Icon: MapPin, label: "Rize, Türkiye" },
  { Icon: GraduationCap, label: "Computer Engineering · 2nd year" },
  { Icon: Sparkles, label: "Currently: AI, automation & backend" },
];

const TIMELINE = [
  {
    period: "2024 — present",
    title: "Recep Tayyip Erdoğan University",
    detail: "B.Sc. Computer Engineering · GPA 2.71/4.00",
    note: "Coursework I did well in: Computer Networks (AA), Differential Equations (AA), Linear Algebra (AA), Data Structures, OOP, Databases, Operating Systems.",
  },
  {
    period: "2023 — 2024",
    title: "Adana Alparslan Türkeş Science & Technology University",
    detail: "English Preparatory School · passed 81/100 (Advanced)",
    note: "TEOL Advanced English certificate.",
  },
];

const SKILLS: { heading: string; items: string[] }[] = [
  { heading: "LANGUAGES", items: ["Python", "Java", "C / C++", "SQL", "JavaScript"] },
  { heading: "AI / ML", items: ["TensorFlow", "LangChain", "RAG", "ChromaDB", "scikit-learn"] },
  { heading: "WEB & BACKEND", items: ["Next.js", "FastAPI", "Streamlit", "Node.js", "Supabase"] },
  { heading: "TOOLS", items: ["Git", "Docker", "PostgreSQL", "n8n", "CMake"] },
  { heading: "LEARNING", items: ["Operating systems", "Distributed systems", "System design"] },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT"
        title="Hi, I'm Metehan."
        tagline="A Computer Engineering student who learns by building — AI systems, automation, and the web around them."
        accent="--accent1"
      />

      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <Reveal>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
            {QUICK_FACTS.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5" style={{ color: "var(--accent3)" }} />
                {label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 space-y-4 text-base leading-relaxed text-fg-2">
          <p>
            I&apos;m a second-year Computer Engineering student in Turkey. I got
            into software because I wanted to build things I&apos;d actually use
            — and the fastest way to learn how something works is to try to ship
            it. So far that&apos;s meant 8+ projects deployed to production.
          </p>
          <p>
            Most of my energy goes into AI and automation: retrieval pipelines
            (RAG), LLM tooling, transfer-learning demos, and web-scraping bots
            with real notifications. I&apos;ve also shipped a commercial
            automation product on Gumroad, and on the web side I build
            full-stack apps with Next.js and Supabase. I like the unglamorous
            parts — measuring quality, cutting cost, making things reproducible.
          </p>
          <p>
            Right now I&apos;m on the software team for a{" "}
            <strong className="text-fg">Teknofest 2026</strong> project and
            looking for a summer internship in backend, AI engineering, or
            FinTech — somewhere I can learn from people who ship serious
            software.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">
            Education
          </h2>
          <ul className="mt-4 space-y-6">
            {TIMELINE.map((t) => (
              <li
                key={t.title}
                className="border-l-2 border-border pl-4"
              >
                <span className="font-mono text-xs text-muted">{t.period}</span>
                <p className="mt-1 font-medium text-fg">{t.title}</p>
                <p className="text-sm text-muted">{t.detail}</p>
                <p className="mt-1 text-sm text-muted">{t.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">
            Skills
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {SKILLS.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {col.heading}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {col.items.map((s) => (
                    <li key={s} className="text-sm text-fg-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-muted">
            Languages: Turkish (native) · English (B2, advanced)
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <a
            href="/cv.pdf"
            className="group inline-flex items-center gap-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg"
          >
            <Download className="size-4" />
            <span className="u-grad pb-0.5">Download CV (PDF)</span>
          </a>
        </Reveal>
      </div>
    </>
  );
}
