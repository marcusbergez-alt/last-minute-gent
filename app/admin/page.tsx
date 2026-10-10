import { createClient } from "@/lib/supabase/server";
import {
  BUSINESS_STATUS_LABEL,
  BUSINESS_TYPE_LABEL,
  type Business,
} from "@/lib/types";
import { setBusinessStatusAction } from "./actions";

const DT = new Intl.DateTimeFormat("nl-BE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Brussels",
});

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .order("aangemaakt_op", { ascending: false });

  const businesses = (data ?? []) as Business[];
  const aangemeld = businesses.filter((b) => b.status === "aangemeld");
  const goedgekeurd = businesses.filter((b) => b.status === "goedgekeurd");
  const gepauzeerd = businesses.filter((b) => b.status === "gepauzeerd");

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-5 py-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700">
          Wachtend op goedkeuring ({aangemeld.length})
        </h2>
        {aangemeld.length === 0 ? (
          <p className="text-sm text-zinc-500">Geen openstaande aanvragen.</p>
        ) : (
          <ul className="space-y-3">
            {aangemeld.map((b) => (
              <BusinessRow key={b.id} business={b} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Goedgekeurd ({goedgekeurd.length})
        </h2>
        {goedgekeurd.length === 0 ? (
          <p className="text-sm text-zinc-500">Nog geen goedgekeurde zaken.</p>
        ) : (
          <ul className="space-y-3">
            {goedgekeurd.map((b) => (
              <BusinessRow key={b.id} business={b} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Gepauzeerd ({gepauzeerd.length})
        </h2>
        {gepauzeerd.length === 0 ? (
          <p className="text-sm text-zinc-500">Geen gepauzeerde zaken.</p>
        ) : (
          <ul className="space-y-3">
            {gepauzeerd.map((b) => (
              <BusinessRow key={b.id} business={b} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function BusinessRow({ business }: { business: Business }) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{business.naam}</h3>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
              {BUSINESS_TYPE_LABEL[business.type]}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Aangemeld op {DT.format(new Date(business.aangemaakt_op))}
          </p>
          <p className="text-xs text-zinc-600">
            {business.email ?? "—"} · {business.gsm ?? "—"} ·{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5">
              {business.slug}
            </code>
          </p>
          {business.adres && (
            <p className="text-xs text-zinc-500">{business.adres}</p>
          )}
          {business.instagram && (
            <p className="text-xs text-zinc-500">
              Instagram: {business.instagram}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {business.status !== "goedgekeurd" && (
            <StatusButton id={business.id} to="goedgekeurd" label="Goedkeuren" />
          )}
          {business.status !== "gepauzeerd" && (
            <StatusButton
              id={business.id}
              to="gepauzeerd"
              label="Pauzeren"
              variant="neutral"
            />
          )}
          {business.status === "gepauzeerd" && (
            <StatusButton
              id={business.id}
              to="aangemeld"
              label="Terug naar aangemeld"
              variant="neutral"
            />
          )}
        </div>
      </div>
    </li>
  );
}

function StatusButton(props: {
  id: string;
  to: "aangemeld" | "goedgekeurd" | "gepauzeerd";
  label: string;
  variant?: "primary" | "neutral";
}) {
  const styles =
    props.variant === "neutral"
      ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
      : "bg-emerald-600 text-white hover:bg-emerald-700";
  return (
    <form action={setBusinessStatusAction}>
      <input type="hidden" name="business_id" value={props.id} />
      <input type="hidden" name="status" value={props.to} />
      <button
        type="submit"
        className={`rounded-md px-3 py-1.5 text-xs font-medium ${styles}`}
      >
        {props.label}
      </button>
    </form>
  );
}
