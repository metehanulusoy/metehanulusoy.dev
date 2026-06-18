import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { AuroraBackground } from "@/components/aurora-background";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://metehanulusoy.dev"),
  title: {
    default: "Metehan Ulusoy — Computer Engineering student & builder",
    template: "%s — Metehan Ulusoy",
  },
  description:
    "Portfolio and technical blog of Metehan Ulusoy — a Computer Engineering student building AI systems, LLM infrastructure, and the full-stack web.",
  openGraph: {
    type: "website",
    siteName: "Metehan Ulusoy",
    url: "https://metehanulusoy.dev",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <AuroraBackground />
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
