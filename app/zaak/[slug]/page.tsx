import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  BUSINESS_TYPE_LABEL,
  type Business,
  type Slot,
} from "@/lib/types";

type Params = { slug: string };

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const TIME = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Brussels",
});

export async function generateMetadata(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("naam, type")
    .eq("slug", slug)
    .eq("status", "goedgekeurd")
    .maybeSingle();

  if (!data) return { title: "Niet gevonden" };
  return {
    title: `${data.naam} — Last-minute afspraken`,
    description: `Open last-minute slots bij ${data.naam} in Gent.`,
  };
}

export default async function ZaakPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "goedgekeurd")
    .maybeSingle<Business>();

  if (!business) notFound();

  const { data: slotsData } = await supabase
    .from("slots")
    .select("*")
    .eq("business_id", business.id)
    .eq("status", "open")
    .gt("start_tijd", new Date().toISOString())
    .order("start_tijd", { ascending: true });

  const slots = (slotsData ?? []) as Slot[];

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Alle deals
        </Link>

        <header className="mt-6 space-y-4">
          {business.foto_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.foto_url}
              alt={business.naam}
              className="aspect-[16/9] w-full rounded-xl object-cover"
            />
          )}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              {BUSINESS_TYPE_LABEL[business.type]}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {business.naam}
            </h1>
            {business.adres && (
              <p className="text-sm text-zinc-600">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.adres)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {business.adres}
                </a>
              </p>
            )}
            {business.instagram && (
              <p className="text-sm text-zinc-600">
                <a
                  href={`https://www.instagram.com/${business.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {business.instagram.startsWith("@")
                    ? business.instagram
                    : `@${business.instagram}`}
                </a>
              </p>
            )}
          </div>
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Open slots ({slots.length})
          </h2>
          {slots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-600">
              Momenteel geen open last-minute slots. Kom later terug.
            </div>
          ) : (
            <ul className="space-y-3">
              {slots.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/deal/${s.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {s.behandeling_naam ?? "Behandeling"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {TIME.format(new Date(s.start_tijd))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {EURO.format(Number(s.kortingsprijs))}
                      </p>
                      <p className="text-xs text-zinc-400 line-through">
                        {EURO.format(Number(s.normale_prijs))}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
