import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 md:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-4">
        Status 404 · page not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        You took a wrong turn somewhere.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist. Maybe it never did,
        maybe I deleted it, maybe you mistyped.
      </p>

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
          ← go home
        </Link>
        <Link href="/projects" className="text-accent-3 hover:text-accent-2">
          see projects →
        </Link>
      </div>
    </section>
  );
}
