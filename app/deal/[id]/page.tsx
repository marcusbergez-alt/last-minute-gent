import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BUSINESS_TYPE_LABEL,
  type BusinessType,
} from "@/lib/types";
import { ClaimForm } from "./claim-form";

type Params = { id: string };

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("slots")
    .select("behandeling_naam, business:businesses(naam)")
    .eq("id", id)
    .maybeSingle<{
      behandeling_naam: string | null;
      business: { naam: string } | null;
    }>();

  const beh = data?.behandeling_naam ?? "Last-minute deal";
  const zaak = data?.business?.naam ?? "Gentse zaak";
  const title = `${beh} bij ${zaak}`;
  const description = `Claim deze last-minute plek bij ${zaak} in Gent met korting. Betaal in de zaak, geen online betaling.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

type SlotWithBusiness = {
  id: string;
  start_tijd: string;
  behandeling_naam: string | null;
  kortingsprijs: number;
  normale_prijs: number;
  status: "open" | "geclaimd" | "voorbij" | "geannuleerd";
  business: {
    naam: string;
    slug: string;
    type: BusinessType;
    adres: string | null;
    foto_url: string | null;
    instagram: string | null;
  } | null;
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

export default async function DealPage(props: {
  params: Promise<Params>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("slots")
    .select(
      `
      id, start_tijd, behandeling_naam, kortingsprijs, normale_prijs, status,
      business:businesses!inner(naam, slug, type, adres, foto_url, instagram)
    `,
    )
    .eq("id", id)
    .maybeSingle<SlotWithBusiness>();

  if (!data) notFound();

  const kortingsPct = Math.round(
    (1 - Number(data.kortingsprijs) / Number(data.normale_prijs)) * 100,
  );
  const beschikbaar = data.status === "open";

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-xl px-5 py-8 sm:py-12">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Alle deals
        </Link>

        {data.business?.foto_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.business.foto_url}
            alt={data.business.naam}
            className="mt-5 aspect-[16/9] w-full rounded-xl object-cover"
          />
        )}

        <section className="mt-6 space-y-2">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            {data.business
              ? BUSINESS_TYPE_LABEL[data.business.type]
              : "Zaak"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {data.behandeling_naam ?? "Behandeling"}
          </h1>
          <p className="text-sm text-zinc-700">
            <Link
              href={`/zaak/${data.business?.slug}`}
              className="font-medium underline-offset-2 hover:underline"
            >
              {data.business?.naam}
            </Link>
            {data.business?.adres ? ` · ${data.business.adres}` : null}
          </p>
          <p className="text-sm text-zinc-600">
            {DT.format(new Date(data.start_tijd))}
          </p>
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-semibold">
              {EURO.format(Number(data.kortingsprijs))}
            </span>
            <span className="text-sm text-zinc-400 line-through">
              {EURO.format(Number(data.normale_prijs))}
            </span>
            {kortingsPct > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                −{kortingsPct}%
              </span>
            )}
          </div>
        </section>

        {beschikbaar ? (
          <section className="mt-8 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Claim deze plek
            </h2>
            <ClaimForm slotId={data.id} />
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Deze plek is helaas niet meer beschikbaar.
            <Link href="/" className="ml-1 font-medium underline">
              Bekijk andere deals →
            </Link>
          </section>
        )}

        <p className="mt-6 text-xs text-zinc-500">
          Je betaalt pas in de zaak. We mailen je de bevestigingscode.
        </p>
      </div>
    </main>
  );
}
