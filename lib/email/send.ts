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
  const resend = getResend();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY ontbreekt — digest voor ${to.length} subscribers niet verzonden.`,
    );
    return { skipped: true as const };
  }

  const html = await render(NewSlotDigestEmail(props));
  const text = await render(NewSlotDigestEmail(props), { plainText: true });
  const subject = `Nieuwe deal: ${props.behandeling} bij ${props.zaakNaam}`;
  const from = getEmailFrom();

  // Resend's batch endpoint stuurt tot 100 mails per call en respecteert
  // de 'onboarding@resend.dev' restrictie per recipient individueel.
  let sent = 0;
  let errored = 0;
  const chunks: string[][] = [];
  for (let i = 0; i < to.length; i += 100) chunks.push(to.slice(i, i + 100));

  for (const chunk of chunks) {
    const payload = chunk.map((email) => ({
      from,
      to: email,
      subject,
      html,
      text,
      tags: [{ name: "type", value: "new-slot-digest" }],
    }));
    const { data, error } = await resend.batch.send(payload);
    if (error) {
      console.error("[email] digest batch error:", error);
      errored += chunk.length;
      continue;
    }
    sent += data?.data?.length ?? chunk.length;
  }
  console.log(
    `[email] digest verzonden: ${sent}/${to.length} subscribers (${errored} errors).`,
  );
  return { ok: true as const, sent };
}
