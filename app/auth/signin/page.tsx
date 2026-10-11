import Link from "next/link";
import { signinAction } from "./actions";

type SearchParams = { error?: string };

export const metadata = {
  title: "Inloggen — Last-minute Gent",
};

export default async function SigninPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-8 px-5 py-10">
      <header className="space-y-2">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Terug
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Inloggen</h1>
        <p className="text-sm text-zinc-600">
          We sturen je een inloglink per e-mail. Geen wachtwoord nodig.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={signinAction} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">E-mailadres</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="jij@zaak.be"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Stuur mij een inloglink
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Nog geen zaak?{" "}
        <Link
          href="/voor-zaken"
          className="font-medium text-zinc-900 underline"
        >
          Meld je aan
        </Link>
      </p>
    </main>
  );
}
