import { Reveal } from "@/components/reveal";
import { RevealText } from "@/components/reveal-text";

/** Shared page title block: mono eyebrow + word-revealing heading + tagline. */
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
    <div className="mx-auto max-w-6xl px-6 pt-36 md:px-8">
      <Reveal>
        <p
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: `var(${accent})` }}
        >
          {eyebrow}
        </p>
      </Reveal>
      <RevealText
        as="h1"
        immediate
        text={title}
        className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl"
      />
      {tagline ? (
        <Reveal>
          <p className="mt-4 max-w-2xl text-lg text-muted">{tagline}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
