import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, alternates, localizedUrl } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";
import { AuroraBackground } from "@/components/aurora-background";
import { CursorTrails } from "@/components/cursor-trails";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("titleDefault"),
      template: "%s — Metehan Ulusoy",
    },
    description: t("description"),
    alternates: alternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: "Metehan Ulusoy",
      url: localizedUrl(locale, ""),
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering with next-intl (otherwise the whole tree is dynamic).
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    // Dark-first: SSR ships the `dark` class; ThemeProvider switches returning
    // light-mode users on mount (suppressHydrationWarning covers that class flip).
    // No blocking inline theme script — React 19 doesn't allow rendering one inside
    // a component without warning — so a returning light-mode user may see one
    // dark frame. data-scroll-behavior tells Next the smooth scroll is intentional.
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <ScrollProgress />
            <AuroraBackground />
            <CursorTrails />
            <SiteNav />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
