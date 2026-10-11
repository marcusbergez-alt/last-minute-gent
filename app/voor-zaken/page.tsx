import Link from "next/link";
import { signupAction } from "./actions";
import { BUSINESS_TYPES, BUSINESS_TYPE_LABEL } from "@/lib/types";

type SearchParams = { error?: string };

export const metadata = {
  title: "Voor zaken — Last-minute Gent",
  description:
    "Meld je Gentse salon aan en vul lege last-minute slots met korting.",
};

export default async function VoorZakenPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-8 px-5 py-10">
      <header className="space-y-2">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Terug
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Meld je zaak aan
        </h1>
        <p className="text-sm text-zinc-600">
          Vul een leeg slot op binnen de 30 seconden. Je betaalt enkel per
          afspraak die écht doorgaat. Eerste maand gratis.
        </p>
      </header>

      <ol className="space-y-3 text-sm text-zinc-700">
        <li className="flex gap-3">
          <span className="font-mono text-zinc-400">1.</span>
          Zet een leeg slot online in je dashboard.
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-zinc-400">2.</span>
          Een klant uit Gent claimt het, krijgt een code per e-mail.
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-zinc-400">3.</span>
          Klant komt langs en betaalt de kortingsprijs in de zaak.
        </li>
      </ol>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={signupAction} className="space-y-4">
        <Field
          name="zaaknaam"
          label="Naam van je zaak"
          placeholder="Bv. Studio Luna"
          required
        />
        <Field
          name="contactpersoon"
          label="Contactpersoon"
          placeholder="Voornaam en naam"
          required
        />
        <Field
          name="email"
          type="email"
          label="E-mailadres"
          placeholder="jij@zaak.be"
          autoComplete="email"
          required
        />
        <Field
          name="gsm"
          type="tel"
          label="Gsm-nummer"
          placeholder="0470 00 00 00"
          autoComplete="tel"
          required
        />
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">Type zaak</span>
          <select
            name="type"
            required
            defaultValue=""
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            <option value="" disabled>
              Kies…
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {BUSINESS_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Meld mijn zaak aan
        </button>
        <p className="text-xs text-zinc-500">
          Je krijgt een inloglink per e-mail. We bellen of mailen enkel in
          verband met je account. Door door te gaan ga je akkoord met onze
          voorwaarden (volgt).
        </p>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Al aangemeld?{" "}
        <Link href="/auth/signin" className="font-medium text-zinc-900 underline">
          Inloggen
        </Link>
      </p>
    </main>
  );
}

function Field(props: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-zinc-800">{props.label}</span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
    </label>
  );
}
