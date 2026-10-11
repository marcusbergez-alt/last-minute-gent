"use client";

import { useState, useTransition } from "react";
import { subscribeAction } from "@/app/actions";

export function SubscriberForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row"
      action={(fd) => {
        setStatus("idle");
        setMessage(null);
        startTransition(async () => {
          const result = await subscribeAction(fd);
          if (result.ok) {
            setStatus("ok");
            setMessage("Je staat op de lijst. We mailen zodra er deals zijn.");
          } else {
            setStatus("error");
            setMessage(result.error ?? "Er ging iets mis.");
          }
        });
      }}
    >
      <input type="hidden" name="bron" value="homepage" />
      <input
        type="email"
        name="email"
        required
        placeholder="jouw e-mailadres"
        autoComplete="email"
        className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm shadow-xs focus:border-zinc-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Bezig…" : "Verwittig me"}
      </button>
      {status !== "idle" && message && (
        <p
          className={`text-xs sm:w-full ${
            status === "ok" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
