import Link from "next/link";
import { getOwnBusiness, requireUser } from "@/lib/auth";
import { BUSINESS_TYPE_LABEL } from "@/lib/types";
import { saveProfileAction } from "./actions";

type SearchParams = { ok?: string; error?: string };

export const metadata = {
  title: "Profiel — Startup 1",
};

export default async function ProfielPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser();
  const business = await getOwnBusiness();
  const { ok, error } = await props.searchParams;

  if (!business) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-10">
        <h1 className="text-2xl font-semibold">Nog geen zaak</h1>
        <Link href="/voor-zaken" className="underline">
          Meld je zaak aan
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 px-5 py-8">
      <header className="space-y-1">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Profiel</h1>
        <p className="text-sm text-zinc-600">
          {BUSINESS_TYPE_LABEL[business.type]} · slug{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
            {business.slug}
          </code>
        </p>
      </header>

      {ok && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Profiel bijgewerkt.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={saveProfileAction} className="space-y-4">
        <Field
          name="naam"
          label="Naam van de zaak"
          defaultValue={business.naam}
          required
        />
        <Field
          name="adres"
          label="Adres"
          defaultValue={business.adres ?? ""}
          placeholder="Straat, nummer, postcode, gemeente"
        />
        <Field
          name="foto_url"
          label="Foto-URL"
          type="url"
          defaultValue={business.foto_url ?? ""}
          placeholder="https://…"
        />
        <Field
          name="instagram"
          label="Instagram"
          defaultValue={business.instagram ?? ""}
          placeholder="@jouwstudio"
        />
        <Field
          name="email"
          label="E-mail (contact)"
          type="email"
          defaultValue={business.email ?? ""}
        />
        <Field
          name="gsm"
          label="Gsm"
          type="tel"
          defaultValue={business.gsm ?? ""}
        />

        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Opslaan
        </button>
      </form>
    </main>
  );
}

function Field(props: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-zinc-800">{props.label}</span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        required={props.required}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
    </label>
  );
}
