"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALES = ["en", "tr"] as const;

export function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const [isPending, startTransition] = useTransition();

  const setLocale = (next: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border p-0.5 font-mono text-xs"
      role="group"
      aria-label={t("toggleLanguage")}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          disabled={isPending}
          aria-pressed={locale === l}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            locale === l ? "bg-surface-2 text-fg" : "text-muted hover:text-fg-2",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
