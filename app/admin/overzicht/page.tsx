import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_TYPE_LABEL, type BusinessType } from "@/lib/types";

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const MONTH = new Intl.DateTimeFormat("nl-BE", {
  year: "numeric",
  month: "long",
  timeZone: "Europe/Brussels",
});

type ClaimRow = {
  status: "bevestigd" | "geannuleerd" | "gekomen" | "niet_gekomen";
  aangemaakt_op: string;
  slot: {
    business: { id: string; naam: string; type: BusinessType } | null;
  } | null;
  customer: { bron: string | null } | null;
};

type SubRow = { bron: string | null };

type MaandZaak = {
  key: string;
  maand: string;
  businessId: string;
  businessNaam: string;
  businessType: BusinessType;
  bevestigd: number;
  gekomen: number;
  niet_gekomen: number;
  geannuleerd: number;
};

export default async function OverzichtPage() {
  const feePerShow = Number(
    process.env.NEXT_PUBLIC_FEE_PER_SHOW ?? "3",
  );

  const admin = createAdminClient();

  const [{ data: claimsData }, { data: subsData }] = await Promise.all([
    admin
      .from("claims")
      .select(
        `status, aangemaakt_op,
         slot:slots(business:businesses(id, naam, type)),
         customer:customers(bron)`,
      )
      .order("aangemaakt_op", { ascending: false }),
    admin.from("subscribers").select("bron"),
  ]);

  const claims = (claimsData ?? []) as unknown as ClaimRow[];
  const subs = (subsData ?? []) as unknown as SubRow[];

  // Groep per maand × zaak
  const perMaandZaak = new Map<string, MaandZaak>();
  for (const c of claims) {
    const biz = c.slot?.business;
    if (!biz) continue;
    const d = new Date(c.aangemaakt_op);
    const maand = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const key = `${maand}:${biz.id}`;
    const entry: MaandZaak = perMaandZaak.get(key) ?? {
      key,
      maand,
      businessId: biz.id,
      businessNaam: biz.naam,
      businessType: biz.type,
      bevestigd: 0,
      gekomen: 0,
      niet_gekomen: 0,
      geannuleerd: 0,
    };
    entry[c.status] += 1;
    perMaandZaak.set(key, entry);
  }
  const maandRijen = Array.from(perMaandZaak.values()).sort((a, b) =>
    b.maand === a.maand
      ? a.businessNaam.localeCompare(b.businessNaam)
      : b.maand.localeCompare(a.maand),
  );

  // Groep per bron (claims)
  const bronClaims = new Map<string, number>();
  for (const c of claims) {
    if (c.status === "geannuleerd") continue;
    const bron = c.customer?.bron?.trim() || "direct";
    bronClaims.set(bron, (bronClaims.get(bron) ?? 0) + 1);
  }

  // Groep per bron (subscribers)
  const bronSubs = new Map<string, number>();
  for (const s of subs) {
    const bron = s.bron?.trim() || "direct";
    bronSubs.set(bron, (bronSubs.get(bron) ?? 0) + 1);
  }

  const allBrons = Array.from(
    new Set([...bronClaims.keys(), ...bronSubs.keys()]),
  ).sort();

  const totalGekomen = claims.filter((c) => c.status === "gekomen").length;

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-5 py-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            ← Admin
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Overzicht
          </h1>
          <p className="text-sm text-zinc-600">
            Facturatiebedrag: €{feePerShow}/afspraak die doorging ·{" "}
            <span className="font-medium text-zinc-900">
              {totalGekomen} totaal
            </span>{" "}
            = {EURO.format(totalGekomen * feePerShow)}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Per zaak per maand ({maandRijen.length})
        </h2>
        {maandRijen.length === 0 ? (
          <p className="text-sm text-zinc-500">Nog geen claims geregistreerd.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-2">Maand</th>
                  <th className="px-4 py-2">Zaak</th>
                  <th className="px-4 py-2 text-right">Bevestigd</th>
                  <th className="px-4 py-2 text-right">Gekomen</th>
                  <th className="px-4 py-2 text-right">Niet gekomen</th>
                  <th className="px-4 py-2 text-right">Geannuleerd</th>
                  <th className="px-4 py-2 text-right">Factuur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {maandRijen.map((r) => (
                  <tr key={r.key}>
                    <td className="whitespace-nowrap px-4 py-2 text-zinc-600">
                      {formatMonthKey(r.maand)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{r.businessNaam}</div>
                      <div className="text-xs text-zinc-500">
                        {BUSINESS_TYPE_LABEL[r.businessType]}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {r.bevestigd}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums font-medium text-emerald-700">
                      {r.gekomen}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-amber-800">
                      {r.niet_gekomen}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-zinc-500">
                      {r.geannuleerd}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums font-semibold">
                      {EURO.format(r.gekomen * feePerShow)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Per bron (UTM)
        </h2>
        {allBrons.length === 0 ? (
          <p className="text-sm text-zinc-500">Nog geen bron-data.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-2">Bron</th>
                  <th className="px-4 py-2 text-right">Inschrijvingen</th>
                  <th className="px-4 py-2 text-right">Claims (niet geann.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {allBrons.map((b) => (
                  <tr key={b}>
                    <td className="px-4 py-2">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                        {b}
                      </code>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {bronSubs.get(b) ?? 0}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums font-medium">
                      {bronClaims.get(b) ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-zinc-500">
          Een bron komt uit <code>utm_source</code> (+ optioneel{" "}
          <code>:utm_campaign</code>) van een link waar de bezoeker binnenkwam.
          Voorbeeld: <code>?utm_source=instagram&amp;utm_campaign=studio-luna</code>{" "}
          bewaart <code>instagram:studio-luna</code>.
        </p>
      </section>
    </main>
  );
}

function formatMonthKey(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return MONTH.format(new Date(y, m - 1, 1));
}
