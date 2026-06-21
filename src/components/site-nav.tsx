"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Escape closes the mobile disclosure.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // No backdrop-filter: blurring the page content scrolling underneath
        // re-samples the backdrop every scroll frame (a classic jank source). A
        // near-opaque solid bar is free to scroll under.
        scrolled && "border-b border-border bg-bg/95",
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
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.key}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative px-3 py-2 text-sm transition-colors",
                  active ? "text-fg" : "text-fg-2 hover:text-fg",
                )}
              >
                <span className="u-grad pb-0.5">{t(l.key)}</span>
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full"
                    style={{ background: "var(--grad-nav-progress)" }}
                  />
                ) : null}
              </Link>
            );
          })}
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
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-lg border border-border text-fg"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-bg/95 md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
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
