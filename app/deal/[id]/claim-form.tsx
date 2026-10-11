"use client";

import { useState, useTransition } from "react";
import { claimAction } from "./actions";

export function ClaimForm({ slotId }: { slotId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const result = await claimAction(fd);
          if (result?.error) setError(result.error);
        });
      }}
      className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5"
    >
      <input type="hidden" name="slot_id" value={slotId} />

      <Field name="naam" label="Jouw naam" placeholder="Voornaam en naam" required />
      <Field
        name="gsm"
        type="tel"
        label="Gsm-nummer"
        placeholder="0470 00 00 00"
        autoComplete="tel"
        required
      />
      <Field
        name="email"
        type="email"
        label="E-mailadres"
        placeholder="jij@email.be"
        autoComplete="email"
        required
      />

      <label className="flex gap-2 pt-1 text-xs text-zinc-700">
        <input
          type="checkbox"
          name="toestemming_marketing"
          value="1"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300"
        />
        <span>
          Verwittig me bij nieuwe deals (optioneel). We mailen zelden en je kan
          altijd uitschrijven.
        </span>
      </label>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {prettyError(error)}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Bezig…" : "Claim deze plek"}
      </button>

      <p className="text-[11px] leading-relaxed text-zinc-500">
        Door te claimen ga je akkoord met de voorwaarden (volgt). We geven enkel
        naam, gsm en code door aan de zaak. Je kan tot 3 uur voor het slot
        gratis annuleren.
      </p>
    </form>
  );
}

function Field(props: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-zinc-800">{props.label}</span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
    </label>
  );
}

function prettyError(code: string): string {
  switch (code) {
    case "slot_not_found":
      return "Dit slot bestaat niet (meer).";
    case "slot_not_open":
      return "Dit slot is intussen door iemand anders geclaimd.";
    case "slot_expired":
      return "Dit slot is intussen voorbij.";
    case "customer_blocked":
      return "Dit nummer kan geen slots meer claimen (2 keer niet komen opdagen).";
    default:
      return code;
  }
}
