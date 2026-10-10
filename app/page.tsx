import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-md space-y-6">
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          Binnenkort online
        </span>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Startup 1
        </h1>
        <p className="text-balance text-base leading-relaxed text-zinc-600">
          Last-minute afspraken bij Gentse kappers, nagel- en wimperstudio{"’"}s
          en schoonheidsspecialisten — met korting.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/voor-zaken"
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Meld je zaak aan
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Inloggen
          </Link>
        </div>
      </div>
    </main>
  );
}
