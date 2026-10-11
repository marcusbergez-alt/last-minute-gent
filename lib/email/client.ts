import { Resend } from "resend";

let cached: Resend | null = null;

/** Lazy singleton zodat ontbrekende key enkel faalt wanneer we echt mailen. */
export function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? "Last-minute Gent <onboarding@resend.dev>";
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
