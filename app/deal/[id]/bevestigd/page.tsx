import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CancelButton } from "./cancel-button";

type Params = { id: string };
type SearchParams = { claim?: string; error?: string };

type Summary = {
  claim_id: string;
  code: string;
  claim_status: "bevestigd" | "geannuleerd" | "gekomen" | "niet_gekomen";
  slot_id: string;
  start_tijd: string;
  kortingsprijs: number;
  normale_prijs: number;
  behandeling_naam: string | null;
  business_naam: string;
  business_slug: string;
  business_adres: string | null;
  business_foto_url: string | null;
  business_instagram: string | null;
};

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const DT = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Brussels",
});

export const metadata = {
  title: "Bevestigd — Last-minute Gent",
};

export default async function BevestigdPage(props: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id: slotId } = await props.params;
  const { claim: claimId, error } = await props.searchParams;

  if (!claimId) notFound();

  const supabase = await createClient();
  const { data, error: rpcError } = await supabase.rpc(
    "get_claim_summary",
    { p_claim_id: claimId },
  );

  const summary = (Array.isArray(data) ? data[0] : data) as
    | Summary
    | undefined;

  if (rpcError || !summary || summary.slot_id !== slotId) notFound();

  const cancelDeadline = new Date(
    new Date(summary.start_tijd).getTime() - 3 * 60 * 60 * 1000,
  );
  const kanAnnuleren =
    summary.claim_status === "bevestigd" && cancelDeadline > new Date();

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-xl px-5 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Je plek is geboekt
          </h1>
          <p className="text-sm text-zinc-600">
            Toon deze code bij aankomst in de zaak.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Bevestigingscode
          </p>
          <p className="mt-2 font-mono text-5xl font-semibold tracking-[0.2em]">
            {summary.code}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Status:{" "}
            <span className="font-medium text-zinc-800">
              {statusLabel(summary.claim_status)}
            </span>
          </p>
        </div>

        <section className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Behandeling
            </p>
            <p className="text-sm font-medium">
              {summary.behandeling_naam ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Zaak
            </p>
            <p className="text-sm">
              <Link
                href={`/zaak/${summary.business_slug}`}
                className="font-medium underline-offset-2 hover:underline"
              >
                {summary.business_naam}
              </Link>
            </p>
            {summary.business_adres && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(summary.business_adres)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-600 underline-offset-2 hover:underline"
              >
                {summary.business_adres}
              </a>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Wanneer
            </p>
            <p className="text-sm">
              {DT.format(new Date(summary.start_tijd))}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Prijs
            </p>
            <p className="text-sm">
              <span className="font-semibold">
                {EURO.format(Number(summary.kortingsprijs))}
              </span>{" "}
              <span className="text-xs text-zinc-400 line-through">
                {EURO.format(Number(summary.normale_prijs))}
              </span>
              <span className="ml-1 text-xs text-zinc-500">
                (betalen in de zaak)
              </span>
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {prettyCancelError(decodeURIComponent(error))}
          </div>
        )}

        {kanAnnuleren && (
          <section className="mt-6">
            <CancelButton claimId={summary.claim_id} slotId={slotId} />
            <p className="mt-2 text-center text-xs text-zinc-500">
              Annuleren kan tot 3 uur voor de afspraak.
            </p>
          </section>
        )}

        {!kanAnnuleren && summary.claim_status === "bevestigd" && (
          <p className="mt-6 text-center text-xs text-zinc-500">
            De annulatie-termijn (3 uur voor start) is verstreken.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Terug naar alle deals
          </Link>
        </div>
      </div>
    </main>
  );
}

function statusLabel(s: Summary["claim_status"]): string {
  switch (s) {
    case "bevestigd":
      return "Bevestigd";
    case "geannuleerd":
      return "Geannuleerd";
    case "gekomen":
      return "Afgehandeld (gekomen)";
    case "niet_gekomen":
      return "Afgehandeld (niet gekomen)";
  }
}

function prettyCancelError(code: string): string {
  switch (code) {
    case "claim_not_found":
      return "Deze boeking werd niet gevonden.";
    case "claim_niet_bevestigd":
      return "Deze boeking is al afgehandeld, annuleren kan niet meer.";
    case "te_laat_om_te_annuleren":
      return "Te laat om nog te annuleren (minder dan 3 uur voor de afspraak).";
    default:
      return code;
  }
}
