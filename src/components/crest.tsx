import type { ReactNode } from "react";

/* One minimal stroke emblem per project archetype, keyed off the primary tag.
   Drawn in the card's accent; redraws itself on hover (see .crest in globals). */
const GLYPHS: Record<string, ReactNode> = {
  ml: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="5" cy="6" r="1.4" />
      <circle cx="19" cy="6" r="1.4" />
      <circle cx="5" cy="18" r="1.4" />
      <circle cx="19" cy="18" r="1.4" />
      <path d="M6.2 7.1 9.6 10M17.8 7.1 14.4 10M6.2 16.9 9.6 14M17.8 16.9 14.4 14" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3.5 13.7 9 19 10.5 13.7 12 12 17.5 10.3 12 5 10.5 10.3 9Z" />
      <circle cx="18.5" cy="5.5" r="1" />
    </>
  ),
  finance: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5v9M9.5 9.6h3.2a2 2 0 0 1 0 4H10" />
    </>
  ),
  automation: (
    <>
      <path d="M5 12a7 7 0 0 1 11.4-5.4M19 12a7 7 0 0 1-11.4 5.4" />
      <path d="M16.5 4.6V7.4H13.7M7.5 19.4V16.6H10.3" />
    </>
  ),
  web: <path d="M9 7.5 4.5 12 9 16.5M15 7.5 19.5 12 15 16.5M13.2 6 10.8 18" />,
  systems: (
    <>
      <path d="M12 3.5 20 7.5 12 11.5 4 7.5Z" />
      <path d="M4 12 12 16 20 12M4 16.3 12 20.3 20 16.3" />
    </>
  ),
};

export function Crest({ archetype }: { archetype: string }) {
  return (
    <svg
      className="crest pointer-events-none absolute right-3 top-3 z-10"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="var(--card-accent, var(--accent2))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {GLYPHS[archetype] ?? GLYPHS.systems}
    </svg>
  );
}
