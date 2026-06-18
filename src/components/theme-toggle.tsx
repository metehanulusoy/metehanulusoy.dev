"use client";

import type { MouseEvent } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/**
 * Toggles the theme. Where supported, the new theme is revealed with a circle
 * expanding from the click point (View Transitions API); otherwise it switches
 * instantly. Icon visibility is CSS-driven off the `.dark` class.
 */
export function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "light" ? "dark" : "light";
    const doc = document as ViewTransitionDocument;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      // Apply the class directly so the transition snapshots the new theme —
      // without forcing next-themes to render its <script> synchronously
      // (which React 19 warns about). next-themes is synced right after.
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });

    setTheme(next);
  };

  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={toggle}
      className="grid size-9 place-items-center rounded-lg border border-border text-fg-2 transition-colors hover:text-accent-3"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="block size-4 dark:hidden" />
    </button>
  );
}
