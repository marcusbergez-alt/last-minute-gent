import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABEL,
  type BusinessType,
} from "@/lib/types";

type Props = {
  when: "vandaag" | "morgen" | "alles";
  type: BusinessType | "alle";
};

type SlotRow = {
  id: string;
  start_tijd: string;
  behandeling_naam: string | null;
  kortingsprijs: number;
  normale_prijs: number;
  business: {
    naam: string;
    slug: string;
    type: BusinessType;
    foto_url: string | null;
    adres: string | null;
  } | null;
};

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const TIME = new Intl.DateTimeFormat("nl-BE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Brussels",
});

function brusselsDateKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  // Returns 'YYYY-MM-DD' op basis van Europe/Brussels tijd.
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
}

function discountPct(normal: number, discount: number) {
  if (!normal) return 0;
  return Math.round((1 - discount / normal) * 100);
}

export async function DealsGrid({ when, type }: Props) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("slots")
    .select(
      `
      id, start_tijd, behandeling_naam, kortingsprijs, normale_prijs,
      business:businesses!inner(naam, slug, type, foto_url, adres)
    `,
    )
    .eq("status", "open")
    .gt("start_tijd", new Date().toISOString())
    .order("start_tijd", { ascending: true });

  let slots = (data ?? []) as unknown as SlotRow[];

  const now = new Date();
  if (when === "vandaag") {
    const key = brusselsDateKey(now);
    slots = slots.filter((s) => brusselsDateKey(s.start_tijd) === key);
  } else if (when === "morgen") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const key = brusselsDateKey(tomorrow);
    slots = slots.filter((s) => brusselsDateKey(s.start_tijd) === key);
  }

  if (type !== "alle") {
    slots = slots.filter((s) => s.business?.type === type);
  }

  return (
    <div className="space-y-6">
      <Filters when={when} type={type} />

      {slots.length === 0 ? (
        <EmptyState when={when} type={type} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((s) => (
            <li key={s.id}>
              <DealCard slot={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filters({ when, type }: Props) {
  const whens: Array<{ key: Props["when"]; label: string }> = [
    { key: "alles", label: "Alles" },
    { key: "vandaag", label: "Vandaag" },
    { key: "morgen", label: "Morgen" },
  ];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1">
        {whens.map((w) => {
          const active = when === w.key;
          const href = buildHref({ when: w.key, type });
          return (
            <Link
              key={w.key}
              href={href}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {w.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <TypeChip label="Alle types" active={type === "alle"} href={buildHref({ when, type: "alle" })} />
        {BUSINESS_TYPES.map((t) => (
          <TypeChip
            key={t}
            label={BUSINESS_TYPE_LABEL[t]}
            active={type === t}
            href={buildHref({ when, type: t })}
          />
        ))}
      </div>
    </div>
  );
}

function TypeChip({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {label}
    </Link>
  );
}

function buildHref(p: Props): string {
  const params = new URLSearchParams();
  if (p.when !== "alles") params.set("when", p.when);
  if (p.type !== "alle") params.set("type", p.type);
  const qs = params.toString();
  return qs ? `/?${qs}#aanbod` : "/#aanbod";
}

function DealCard({ slot }: { slot: SlotRow }) {
  const pct = discountPct(Number(slot.normale_prijs), Number(slot.kortingsprijs));
  return (
    <Link
      href={`/deal/${slot.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="aspect-[3/2] overflow-hidden bg-zinc-100">
        {slot.business?.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slot.business.foto_url}
            alt={slot.business.naam}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            {slot.business
              ? BUSINESS_TYPE_LABEL[slot.business.type]
              : "Zaak"}
          </div>
        )}
        {pct > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950">
            −{pct}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          {slot.business
            ? BUSINESS_TYPE_LABEL[slot.business.type]
            : "Zaak"}
        </p>
        <h3 className="text-base font-medium leading-tight">
          {slot.behandeling_naam ?? "Behandeling"}
        </h3>
        <p className="text-sm text-zinc-600">{slot.business?.naam ?? "—"}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {TIME.format(new Date(slot.start_tijd))}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold">
            {EURO.format(Number(slot.kortingsprijs))}
          </span>
          <span className="text-xs text-zinc-400 line-through">
            {EURO.format(Number(slot.normale_prijs))}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ when, type }: Props) {
  const labelWhen =
    when === "vandaag"
      ? "voor vandaag"
      : when === "morgen"
        ? "voor morgen"
        : "op dit moment";
  const labelType =
    type === "alle" ? "" : ` bij ${BUSINESS_TYPE_LABEL[type as BusinessType].toLowerCase()}`;
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <p className="text-sm text-zinc-600">
        Nog geen deals {labelWhen}
        {labelType}.
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Nieuwe slots verschijnen hier zodra zaken ze toevoegen.
      </p>
    </div>
  );
}
