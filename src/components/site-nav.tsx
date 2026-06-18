"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { key: "projects", href: "/projects" },
  { key: "blog", href: "/blog" },
  { key: "now", href: "/now" },
  { key: "about", href: "/about" },
] as const;

export function SiteNav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled && "border-b border-border bg-bg/70 backdrop-blur-xl",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-fg"
        >
          metehan<span className="text-accent-3">.</span>
          <span className="caret text-accent-3">_</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="group relative px-3 py-2 text-sm text-fg-2 transition-colors hover:text-fg"
            >
              <span className="u-grad pb-0.5">{t(l.key)}</span>
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-border" />
          <ThemeToggle />
          <LocaleToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-lg border border-border text-fg"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-bg/90 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LocaleToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
