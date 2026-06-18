# metehanulusoy.dev

Personal portfolio and technical blog for **Metehan Ulusoy** — a Computer
Engineering student building AI systems, LLM infrastructure, and full-stack web.

Built with a vivid, animated "Aurora Arcade" design system.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens) · **Motion** (animation)
- **Geist** fonts · **next-intl** (EN/TR) · **lucide-react** + inline brand icons
- **MDX** blog via `next-mdx-remote` + `rehype-pretty-code` + Shiki
- **Upstash Redis** (view counter) · **Giscus** (comments) — optional, see below

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm lint         # eslint
pnpm exec tsc --noEmit   # typecheck
```

## Environment variables

All optional — features degrade gracefully (hidden) when unset. Copy
`.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Blog view counter ([console.upstash.com](https://console.upstash.com)) |
| `NEXT_PUBLIC_GISCUS_*` | Blog comments ([giscus.app](https://giscus.app); enable Discussions on the repo first) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

## Project structure

```
content/blog/*.mdx          # blog posts (frontmatter + MDX body)
src/app/                    # App Router pages (home, projects, about, now, blog, 404)
src/components/             # nav, footer, providers, sections, ui
src/data/projects.ts        # project list (edit to add/update projects)
src/lib/                    # posts (MDX reader), redis, views, utils
src/i18n/                   # next-intl config
messages/{en,tr}.json       # UI strings
```

## Adding content

- **Blog post:** drop a new `content/blog/<slug>.mdx` with frontmatter
  (`title`, `description`, `date`, `tags`, `category`). No code changes needed.
- **Project:** add an entry to `src/data/projects.ts`.
- **CV:** put your PDF at `public/cv.pdf` (the About page and hero link to it).

## Personalize

Search for these edit points: `UNIVERSITY` / `LOCATION` in `src/app/about/page.tsx`,
`FOCUS` / `UPDATED` in `src/app/now/page.tsx`, and contact handles in
`src/components/site-footer.tsx` and `src/components/sections/bento.tsx`.

## Deploy

Deploy on [Vercel](https://vercel.com/new). Add the env vars above in the
project settings, then connect the `metehanulusoy.dev` domain.

## License

[MIT](./LICENSE) © 2026 Metehan Ulusoy
