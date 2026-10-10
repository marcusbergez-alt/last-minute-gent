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
        <p className="text-sm text-zinc-500">
          Deze site wordt momenteel opgebouwd. Zaak in Gent? Je kan je binnenkort
          aanmelden via <code className="rounded bg-zinc-100 px-1.5 py-0.5">/voor-zaken</code>.
        </p>
      </div>
    </main>
  );
}
