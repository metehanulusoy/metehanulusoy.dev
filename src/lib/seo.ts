import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Canonical origin. Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. a
 *  Vercel preview URL); falls back to the production domain. No trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://metehanulusoy.dev"
).replace(/\/$/, "");

/** Localized URL for a path within a given locale (default locale has no prefix). */
export function localizedUrl(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

/**
 * Path-aware canonical + hreflang alternates for a page. Pass the path WITHOUT a
 * locale prefix (e.g. "/about", "/blog/my-post", or "" for home). Each page sets
 * its own so search engines see the correct per-page en/tr equivalence rather
 * than the site root.
 */
export function alternates(locale: string, path = ""): Metadata["alternates"] {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      en: `${SITE_URL}${path}`,
      tr: `${SITE_URL}/tr${path}`,
      "x-default": `${SITE_URL}${path}`,
    },
  };
}
