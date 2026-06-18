import { Reveal } from "@/components/reveal";

/** Shared page title block: mono eyebrow + large heading + optional tagline. */
export function PageHeader({
  eyebrow,
  title,
  tagline,
  accent = "--accent2",
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  accent?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-6xl px-6 pt-36 md:px-8">
      <p
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: `var(${accent})` }}
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h1>
      {tagline ? (
        <p className="mt-4 max-w-2xl text-lg text-muted">{tagline}</p>
      ) : null}
    </Reveal>
  );
}
