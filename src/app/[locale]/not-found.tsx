import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 md:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-4">
        {t("status")}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-muted">{t("body")}</p>

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
          ← {t("goHome")}
        </Link>
        <Link href="/projects" className="text-accent-3 hover:text-accent-2">
          {t("seeProjects")} →
        </Link>
      </div>
    </section>
  );
}
