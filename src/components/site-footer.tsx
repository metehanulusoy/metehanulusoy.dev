"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, Mail, ShoppingBag } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";

const SOCIALS: { Icon: ComponentType<{ className?: string }>; href: string; label: string }[] = [
  { Icon: GithubIcon, href: "https://github.com/metehanulusoy", label: "GitHub" },
  {
    Icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/metehanulusoy",
    label: "LinkedIn",
  },
  { Icon: ShoppingBag, href: "https://metmete.gumroad.com", label: "Gumroad" },
  { Icon: Mail, href: "mailto:metehan_ulusoy24@erdogan.edu.tr", label: "Email" },
];

const SITEMAP = ["projects", "blog", "now", "about"] as const;
const SITEMAP_HREF: Record<(typeof SITEMAP)[number], string> = {
  projects: "/projects",
  blog: "/blog",
  now: "/now",
  about: "/about",
};

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = 2026;

  return (
    <footer
      id="connect"
      className="relative mt-24 scroll-mt-24 border-t border-border"
    >
      <div
        aria-hidden
        className="h-px w-full"
        style={{ background: "var(--grad-divider)" }}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:px-8">
        <div className="space-y-3">
          <p className="font-mono text-sm font-medium text-fg">
            Metehan Ulusoy
          </p>
          <p className="max-w-xs text-sm text-muted">{t("bio")}</p>
          <a
            href="mailto:metehan_ulusoy24@erdogan.edu.tr"
            className="group inline-block text-sm text-fg-2 transition-colors hover:text-fg"
          >
            <span className="u-grad pb-0.5">metehan_ulusoy24@erdogan.edu.tr</span>
          </a>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {t("sitemap")}
          </p>
          <ul className="space-y-2">
            {SITEMAP.map((key) => (
              <li key={key}>
                <Link
                  href={SITEMAP_HREF[key]}
                  className="text-sm text-fg-2 transition-colors hover:text-accent-1"
                >
                  {nav(key)}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/rss.xml"
                className="font-mono text-sm text-muted transition-colors hover:text-accent-1"
              >
                RSS
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {t("social")}
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-xl border border-border text-fg-2 transition-colors hover:border-accent-1 hover:text-accent-1"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 font-mono text-xs text-muted md:flex-row md:px-8">
          <p>
            © {year} Metehan Ulusoy · {t("builtWith")}
          </p>
          <button
            type="button"
            aria-label={t("backToTop")}
            onClick={() => {
              const reduce = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
              ).matches;
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            }}
            className="group inline-flex items-center gap-1.5 text-fg-2 transition-colors hover:text-accent-3"
          >
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            top
          </button>
        </div>
      </div>
    </footer>
  );
}
