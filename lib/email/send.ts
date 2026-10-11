import { render } from "@react-email/render";
import {
  ClaimConfirmationEmail,
  type ClaimConfirmationProps,
} from "./templates/claim-confirmation";
import {
  BusinessNotificationEmail,
  type BusinessNotificationProps,
} from "./templates/business-notification";
import {
  NewSlotDigestEmail,
  type NewSlotDigestProps,
} from "./templates/new-slot-digest";
import { getEmailFrom, getResend } from "./client";

async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  tag?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY ontbreekt — e-mail "${opts.subject}" niet verzonden.`,
    );
    return { skipped: true as const };
  }
  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    tags: opts.tag ? [{ name: "type", value: opts.tag }] : undefined,
  });
  if (error) {
    console.error("[email] Resend error:", error);
    return { error: error.message };
  }
  return { ok: true as const };
}

export async function sendClaimConfirmation(
  to: string,
  props: ClaimConfirmationProps,
) {
  const html = await render(ClaimConfirmationEmail(props));
  const text = await render(ClaimConfirmationEmail(props), {
    plainText: true,
  });
  return send({
    to,
    subject: `Je plek bij ${props.zaakNaam} is bevestigd — code ${props.code}`,
    html,
    text,
    tag: "claim-confirmation",
  });
}

export async function sendBusinessNotification(
  to: string,
  props: BusinessNotificationProps,
) {
  const html = await render(BusinessNotificationEmail(props));
  const text = await render(BusinessNotificationEmail(props), {
    plainText: true,
  });
  return send({
    to,
    subject: `Nieuwe boeking: ${props.behandeling}`,
    html,
    text,
    tag: "business-notification",
  });
}

export async function sendNewSlotDigest(
  to: string[],
  props: NewSlotDigestProps,
) {
  if (to.length === 0) return { skipped: true as const };
  const html = await render(NewSlotDigestEmail(props));
  const text = await render(NewSlotDigestEmail(props), { plainText: true });

  // Resend accepteert max 50 'to'-adressen per call. We chunken naar 50
  // en gebruiken 'bcc' zodat ontvangers elkaar niet zien.
  const resend = getResend();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY ontbreekt — digest voor ${to.length} subscribers niet verzonden.`,
    );
    return { skipped: true as const };
  }
  const chunks: string[][] = [];
  for (let i = 0; i < to.length; i += 50) chunks.push(to.slice(i, i + 50));

  let sent = 0;
  for (const chunk of chunks) {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: getEmailFrom(),
      bcc: chunk,
      subject: `Nieuwe deal: ${props.behandeling} bij ${props.zaakNaam}`,
      html,
      text,
      tags: [{ name: "type", value: "new-slot-digest" }],
    });
    if (error) {
      console.error("[email] digest chunk error:", error);
      continue;
    }
    sent += chunk.length;
  }
  return { ok: true as const, sent };
}
