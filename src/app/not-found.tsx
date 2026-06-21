import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SITE_URL } from "@/lib/seo";
import en from "../../messages/en.json";
import "./globals.css";

const t = en.notFound;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: t.title,
};

/**
 * Branded fallback for URLs that never enter the [locale] segment (typos,
 * unknown locales like /de, bad inbound links). It renders its own <html>/<body>
 * because the pass-through root layout provides none, and uses hardcoded English
 * copy so it has no dependency on the next-intl request context.
 */
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <section className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-4">
            {t.status}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-md text-muted">{t.body}</p>

          <pre
            aria-hidden
            className="mt-8 overflow-x-auto font-mono text-xs leading-tight text-muted"
          >
            {String.raw`
  404
  ~/$ cd /that-page
  bash: cd: /that-page: No such file or directory
`}
          </pre>

          <div className="mt-8 flex gap-4 font-mono text-sm">
            <Link href="/" className="text-accent-1 hover:text-accent-2">
              ← {t.goHome}
            </Link>
            <Link href="/projects" className="text-accent-3 hover:text-accent-2">
              {t.seeProjects} →
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}
