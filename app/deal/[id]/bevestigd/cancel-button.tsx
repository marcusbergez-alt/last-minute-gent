"use client";

import { useState, useTransition } from "react";
import { cancelClaimAction } from "./actions";

export function CancelButton({
  claimId,
  slotId,
}: {
  claimId: string;
  slotId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <form
          action={() => {
            const fd = new FormData();
            fd.set("claim_id", claimId);
            fd.set("slot_id", slotId);
            startTransition(() => {
              cancelClaimAction(fd);
            });
          }}
          className="flex-1"
        >
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Bezig…" : "Ja, annuleer"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Nee, laat staan
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
    >
      Annuleer deze boeking
    </button>
  );
}
