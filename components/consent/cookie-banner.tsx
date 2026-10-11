"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "lmg_consent_v1";

export type ConsentValue = "accepted" | "essential";

function emitConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(
    new CustomEvent("lmg:consent", { detail: value }),
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = localStorage.getItem(CONSENT_KEY);
    if (!existing) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-instellingen"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-700">
          <p>
            We gebruiken enkel essentiële cookies om de site te laten werken.
            Als je ok bent met advertenties mogen we ook een Meta-pixel laden
            om campagnes te meten.{" "}
            <Link
              href="/privacy"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Meer uitleg
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              emitConsent("essential");
              setVisible(false);
            }}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Alleen essentieel
          </button>
          <button
            type="button"
            onClick={() => {
              emitConsent("accepted");
              setVisible(false);
            }}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Accepteer alles
          </button>
        </div>
      </div>
    </div>
  );
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "essential" ? v : null;
}
