import Link from "next/link";
import { getOwnBusiness, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  BUSINESS_STATUS_LABEL,
  BUSINESS_TYPE_LABEL,
  SLOT_STATUS_LABEL,
  type Slot,
  type ClaimStatus,
} from "@/lib/types";
import { AddSlotForm } from "./add-slot-form";
import { markClaimAction } from "./actions";

type SlotRow = Slot & {
  claims: Array<{
    id: string;
    code: string;
    status: ClaimStatus;
    customer: { naam: string; gsm: string } | null;
  }>;
};

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const DT = new Intl.DateTimeFormat("nl-BE", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Brussels",
});

export default async function DashboardPage() {
  await requireUser();
  const business = await getOwnBusiness();

  if (!business) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-10">
        <h1 className="text-2xl font-semibold">Welkom</h1>
        <p className="text-sm text-zinc-600">
          Je bent ingelogd, maar hebt nog geen zaak geregistreerd.
        </p>
        <Link
          href="/voor-zaken"
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Meld je zaak aan
        </Link>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: slotsRaw } = await supabase
    .from("slots")
    .select(
      `
      *,
      claims(id, code, status, customer:customers(naam, gsm))
    `,
    )
    .eq("business_id", business.id)
    .order("start_tijd", { ascending: false });

  const slots = (slotsRaw ?? []) as SlotRow[];

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{business.naam}</h1>
            <p className="text-xs text-zinc-500">
              {BUSINESS_TYPE_LABEL[business.type]}
            </p>
          </div>
          <StatusBadge status={business.status} />
        </div>
        {business.status === "aangemeld" && (
          <p className="mt-3 text-sm text-zinc-600">
            Je aanmelding is ontvangen. Je zaak verschijnt pas publiek nadat we
            ze goedkeuren. Je mag al slots toevoegen — ze zijn tot dan niet
            zichtbaar voor klanten.
          </p>
        )}
        {business.status === "gepauzeerd" && (
          <p className="mt-3 text-sm text-amber-800">
            Je account staat op pauze. Contacteer de beheerder.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Nieuw slot
        </h2>
        <AddSlotForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Jouw slots ({slots.length})
        </h2>
        {slots.length === 0 ? (
          <p className="text-sm text-zinc-500">Nog geen slots.</p>
        ) : (
          <ul className="space-y-3">
            {slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: "aangemeld" | "goedgekeurd" | "gepauzeerd";
}) {
  const styles: Record<typeof status, string> = {
    aangemeld: "bg-amber-100 text-amber-900",
    goedgekeurd: "bg-emerald-100 text-emerald-900",
    gepauzeerd: "bg-zinc-200 text-zinc-700",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {BUSINESS_STATUS_LABEL[status]}
    </span>
  );
}

function SlotCard({ slot }: { slot: SlotRow }) {
  const claim = slot.claims?.find((c) => c.status === "bevestigd") ??
    slot.claims?.[0];

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {slot.behandeling_naam ?? "Behandeling"}
          </p>
          <p className="text-xs text-zinc-500">
            {DT.format(new Date(slot.start_tijd))}
          </p>
          <p className="text-xs text-zinc-500">
            <span className="line-through">
              {EURO.format(Number(slot.normale_prijs))}
            </span>{" "}
            →{" "}
            <span className="font-medium text-zinc-900">
              {EURO.format(Number(slot.kortingsprijs))}
            </span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs">
          {SLOT_STATUS_LABEL[slot.status]}
        </span>
      </div>

      {claim && (
        <div className="mt-3 rounded-md bg-zinc-50 p-3 text-xs">
          <p>
            <span className="text-zinc-500">Geclaimd door:</span>{" "}
            <span className="font-medium">
              {claim.customer?.naam ?? "—"}
            </span>{" "}
            · {claim.customer?.gsm ?? ""}
          </p>
          <p>
            <span className="text-zinc-500">Code:</span>{" "}
            <span className="font-mono font-semibold">{claim.code}</span> ·{" "}
            <span className="text-zinc-500">status:</span> {claim.status}
          </p>

          {claim.status === "bevestigd" && (
            <div className="mt-2 flex gap-2">
              <form action={markClaimAction}>
                <input type="hidden" name="claim_id" value={claim.id} />
                <input type="hidden" name="status" value="gekomen" />
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Gekomen
                </button>
              </form>
              <form action={markClaimAction}>
                <input type="hidden" name="claim_id" value={claim.id} />
                <input type="hidden" name="status" value="niet_gekomen" />
                <button
                  type="submit"
                  className="rounded-md bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-300"
                >
                  Niet gekomen
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
