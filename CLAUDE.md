# metehanulusoy.dev

Personal portfolio + technical blog for Metehan Ulusoy.
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Motion. Package manager: pnpm.
See `@AGENTS.md` for Next 16 breaking-change warnings.

## Commands
- Dev: `pnpm dev` (http://localhost:3000)
- Build: `pnpm build` — run this to surface type/route errors
- Lint: `pnpm lint`
- Typecheck: `pnpm exec tsc --noEmit`

## Architecture
- Pages: `src/app/[locale]/` — App Router under a locale segment; `[locale]/layout.tsx` wires providers, `[locale]/page.tsx` is the homepage. `src/app/globals.css` + `favicon.ico` stay at `src/app/`.
- UI: `src/components/ui/` (primitives), `src/components/sections/` (page sections), `src/components/` (providers, nav, footer).
- Design tokens: `src/app/globals.css` — Tailwind v4 CSS-first `@theme` (OKLCH colors, gradients, motion vars). Dark-first; `.light` class overrides.
- i18n: `next-intl` with URL routing — `/` (en) and `/tr`; config in `src/i18n/{routing,navigation,request}.ts`, `src/proxy.ts` (Next 16 middleware successor). Use `Link`/`useRouter` from `@/i18n/navigation`. Strings in `messages/{en,tr}.json`.
- Content: blog posts are MDX in `content/blog/`, read by `src/lib/posts.ts`; projects in `src/data/projects.ts`.
- Optional services (graceful/hidden until env set): Upstash view counter (`src/lib/{redis,views}.ts`), Giscus comments (`src/components/comments.tsx`). See `.env.example`.
- Helpers: `src/lib/utils.ts` (`cn()`, `setCookie()`).

## Rules
- Named exports for components; default export only for `page.tsx` / `layout.tsx`.
- Never hardcode colors/spacing — use the design tokens / Tailwind utilities mapped to them.
- Images via `next/image`, never raw `<img>`.
- All motion must respect `prefers-reduced-motion`; keep animations to transform/opacity (GPU-friendly).
- Prefer Server Components; add `"use client"` only when a component needs state/effects/browser APIs.

## Gotchas (Next 16)
- `params` and `searchParams` are Promises — `const { slug } = await params;`. Same inside `generateMetadata`.
- `useRouter` comes from `next/navigation`, NOT `next/router`.
- The visual design intentionally deviates from the spec: it is fully colorful + heavily animated (the spec's minimal/monochrome aesthetic was overridden by the owner). Keep the spec's stack/IA/a11y, not its aesthetic restraint.
