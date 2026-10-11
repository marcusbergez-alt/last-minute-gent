"use client";

import Link from "next/link";
import SplitText from "@/components/SplitText";
import { SubscriberForm } from "./subscriber-form";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Zachte achtergrondgradient. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,#fff5ec_0%,#ffffff_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
      />

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Enkel in Gent · binnenkort online
        </span>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          <SplitText
            text="Vul lege uren."
            tag="span"
            splitType="chars"
            delay={30}
            duration={0.9}
            ease="power3.out"
            threshold={0.1}
            textAlign="center"
            className="block"
          />
          <SplitText
            text="Verdien aan last-minute."
            tag="span"
            splitType="chars"
            delay={25}
            duration={0.9}
            ease="power3.out"
            threshold={0.1}
            textAlign="center"
            className="block text-zinc-500"
          />
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-zinc-600 sm:text-lg">
          Een gratis platform voor Gentse salons om lege slots last-minute met
          korting te verkopen. Je klanten claimen met één klik, betalen in de
          zaak. Jij verdient aan uren die anders leeg bleven.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/voor-zaken"
            className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800"
          >
            Ik heb een zaak
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Inloggen
          </Link>
        </div>

        <div className="mt-14 border-t border-zinc-200 pt-10">
          <p className="text-sm font-medium text-zinc-900">
            Of je bent een klant uit Gent?
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Laat je mailen zodra er last-minute deals opengaan.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-sm">
              <SubscriberForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
