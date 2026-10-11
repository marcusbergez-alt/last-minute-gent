import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/home/reveal";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { DealsGrid } from "@/components/home/deals-grid";
import { BUSINESS_TYPES, type BusinessType } from "@/lib/types";

const VOORDELEN = [
  {
    titel: "Geen abonnement",
    tekst:
      "Je betaalt enkel een vast bedrag per afspraak die effectief doorging. Eerste maand gratis voor testzaken.",
  },
  {
    titel: "Jij blijft baas",
    tekst:
      "Jij kiest welke slots je deelt, met welke korting, en wanneer. Pauzeren kan altijd met één klik.",
  },
  {
    titel: "Klant betaalt in de zaak",
    tekst:
      "Geen online betalingen om op te volgen. We geven je enkel naam, gsm en een code — klant toont de code bij aankomst.",
  },
];

type SearchParams = { when?: string; type?: string };

function normalizeWhen(w?: string): "vandaag" | "morgen" | "alles" {
  return w === "vandaag" || w === "morgen" ? w : "alles";
}

function normalizeType(t?: string): BusinessType | "alle" {
  return (BUSINESS_TYPES as readonly string[]).includes(t ?? "")
    ? (t as BusinessType)
    : "alle";
}

export default async function Home(props: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await props.searchParams;
  const when = normalizeWhen(sp.when);
  const type = normalizeType(sp.type);

  return (
    <LenisProvider>
      <main className="min-h-dvh bg-white">
        <Hero />

        {/* Live aanbod */}
        <section id="aanbod" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Aanbod
              </p>
              <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Open slots in Gent — nu te claimen.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 sm:text-base">
                Elke deal is tot vandaag of morgen beschikbaar. Je claimt met één
                klik en betaalt bij aankomst in de zaak.
              </p>
            </div>
          </Reveal>

          <div className="mt-10">
            <DealsGrid when={when} type={type} />
          </div>
        </section>

        {/* Voor zaken */}
        <section className="border-y border-zinc-200 bg-zinc-50/60">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Voor zaken
                </p>
                <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Lage drempel. Jij houdt controle.
                </h2>
              </div>
            </Reveal>

            <Reveal
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
              stagger={0.1}
              childrenSelector="[data-feat]"
            >
              {VOORDELEN.map((v) => (
                <div
                  key={v.titel}
                  data-feat
                  className="rounded-xl border border-zinc-200 bg-white p-6"
                >
                  <h3 className="text-base font-medium">{v.titel}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {v.tekst}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Klaar om een leeg kwartier geld waard te maken?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-sm text-zinc-600 sm:text-base">
              Aanmelden duurt een minuut. Eerste maand gratis en je kan altijd
              pauzeren.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/voor-zaken"
                className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800"
              >
                Meld je zaak aan
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-zinc-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Startup 1 · Gent</p>
            <nav className="flex gap-4">
              <Link href="/voor-zaken" className="hover:text-zinc-900">
                Voor zaken
              </Link>
              <Link href="/auth/signin" className="hover:text-zinc-900">
                Inloggen
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </LenisProvider>
  );
}
