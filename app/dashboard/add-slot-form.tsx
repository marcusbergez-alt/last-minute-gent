"use client";

import { useRef, useState } from "react";
import { addSlotAction } from "./actions";

export function AddSlotForm() {
  const isoRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLocalChange(value: string) {
    if (!isoRef.current) return;
    if (!value) {
      isoRef.current.value = "";
      return;
    }
    const d = new Date(value);
    isoRef.current.value = Number.isNaN(d.getTime()) ? "" : d.toISOString();
  }

  return (
    <form
      action={async (fd) => {
        setError(null);
        setIsPending(true);
        try {
          const result = await addSlotAction(fd);
          if (result?.error) setError(result.error);
        } finally {
          setIsPending(false);
        }
      }}
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-700">Datum & uur</span>
          <input
            type="datetime-local"
            name="start_tijd_local"
            required
            onChange={(e) => handleLocalChange(e.currentTarget.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <input ref={isoRef} type="hidden" name="start_tijd_iso" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-700">Behandeling</span>
          <input
            type="text"
            name="behandeling_naam"
            required
            placeholder="Bv. Knipbeurt dames"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-700">
            Normale prijs (€)
          </span>
          <input
            type="number"
            name="normale_prijs"
            required
            min="1"
            step="0.01"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-700">
            Kortingsprijs (€)
          </span>
          <input
            type="number"
            name="kortingsprijs"
            required
            min="0"
            step="0.01"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Bezig…" : "Slot toevoegen"}
      </button>
    </form>
  );
}
