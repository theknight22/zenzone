/// <reference types="node" />

"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { getHourInTimeZone, getTomorrowString } from "../lib/slots";
import { APP_TIME_ZONE } from "../lib/constants";
import type { FunctionReturnType } from "convex/server";

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const recipient = to.trim();
  if (!recipient) {
    console.info("Recipient email is empty. Skipping email.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Skipping email.");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ZenZone <onboarding@resend.dev>",
      to: recipient,
      subject,
      html,
    }),
  });
}

function emailHeader(): string {
  return `
    <div style="font-family:'Inter',system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#607050;font-family:'Playfair Display',Georgia,serif;font-size:24px;margin:0;">ZenZone</h1>
        <p style="color:#95a380;font-size:12px;margin:4px 0 0;">Prostor za tvoj oporavak</p>
      </div>`;
}

function emailFooter(): string {
  return `
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8ebe3;text-align:center;">
        <p style="color:#95a380;font-size:12px;margin:0;">ZenZone — Fizioterapija, masaža i hidžama</p>
        <p style="color:#b3bda3;font-size:11px;margin:4px 0 0;">Tuzla, BiH</p>
      </div>
    </div>`;
}

function bookingDetailsHtml(data: {
  serviceName: string;
  date: string;
  time: string;
  mood: string;
  clientName: string;
}): string {
  const moodLabels: Record<string, string> = {
    tisina: "Tišina",
    muzika: "Muzika",
    razgovor: "Razgovor",
  };
  return `
    <div style="background:#f6f7f4;border-radius:12px;padding:16px;margin:16px 0;">
      <table style="width:100%;font-size:14px;color:#6f5f4b;">
        <tr><td style="padding:4px 0;color:#95a380;">Usluga</td><td style="padding:4px 0;text-align:right;font-weight:600;">${data.serviceName}</td></tr>
        <tr><td style="padding:4px 0;color:#95a380;">Datum</td><td style="padding:4px 0;text-align:right;font-weight:600;">${data.date}</td></tr>
        <tr><td style="padding:4px 0;color:#95a380;">Vrijeme</td><td style="padding:4px 0;text-align:right;font-weight:600;">${data.time}</td></tr>
        <tr><td style="padding:4px 0;color:#95a380;">Ambijent</td><td style="padding:4px 0;text-align:right;font-weight:600;">${moodLabels[data.mood] ?? data.mood}</td></tr>
        <tr><td style="padding:4px 0;color:#95a380;">Klijent</td><td style="padding:4px 0;text-align:right;font-weight:600;">${data.clientName}</td></tr>
      </table>
    </div>`;
}

export const sendBookingReceived = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.runQuery(internal.queries.bookings.getBookingInternal, {
      id: args.bookingId,
    });
    if (!booking) return;

    const isHidzama = booking.serviceCategory === "hidzama";
    const hidzamaTip = isHidzama
      ? `<div style="background:#fdf5f2;border-radius:8px;padding:12px;margin:12px 0;font-size:13px;color:#843d2e;">
           Piti puno vode prije i poslije hidžame. Izbjegavajte tešku hranu 2-3 sata prije termina.
         </div>`
      : "";

    const html = `
      ${emailHeader()}
      <h2 style="color:#4c5841;font-size:18px;margin:0 0 8px;">Termin primljen!</h2>
      <p style="color:#6f5f4b;font-size:14px;margin:0 0 12px;">
        Hvala što ste zakazali termin. Vaš termin je u statusu čekanja i biće potvrđen uskoro.
      </p>
      ${bookingDetailsHtml({
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
      })}
      ${hidzamaTip}
      <p style="color:#95a380;font-size:13px;">Odobrenje termina ćete dobiti uskoro na ovu email adresu.</p>
      ${emailFooter()}`;

    await sendEmail({
      to: booking.clientEmail,
      subject: "Termin primljen — ZenZone",
      html,
    });
  },
});

export const sendBookingConfirmed = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.runQuery(internal.queries.bookings.getBookingInternal, {
      id: args.bookingId,
    });
    if (!booking) return;

    const html = `
      ${emailHeader()}
      <h2 style="color:#4c5841;font-size:18px;margin:0 0 8px;">Termin potvrđen!</h2>
      <p style="color:#6f5f4b;font-size:14px;margin:0 0 12px;">
        Vaš termin je potvrđen. Radujemo se vašem dolasku!
      </p>
      ${bookingDetailsHtml({
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
      })}
      <p style="color:#6f5f4b;font-size:13px;">Molimo dođite 5 minuta ranije. Vidimo se!</p>
      ${emailFooter()}`;

    await sendEmail({
      to: booking.clientEmail,
      subject: "Termin potvrđen — ZenZone",
      html,
    });
  },
});

export const sendBookingCancelled = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.runQuery(internal.queries.bookings.getBookingInternal, {
      id: args.bookingId,
    });
    if (!booking) return;

    const html = `
      ${emailHeader()}
      <h2 style="color:#843d2e;font-size:18px;margin:0 0 8px;">Termin otkazan</h2>
      <p style="color:#6f5f4b;font-size:14px;margin:0 0 12px;">
        Vaš termin je nažalost otkazan.
      </p>
      ${bookingDetailsHtml({
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
      })}
      <p style="color:#6f5f4b;font-size:13px;">Možete zakazati novi termin na našoj stranici. Nadamo se da ćete doći uskoro!</p>
      ${emailFooter()}`;

    await sendEmail({
      to: booking.clientEmail,
      subject: "Termin otkazan — ZenZone",
      html,
    });
  },
});

export const sendDailyReminder = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.runQuery(internal.queries.bookings.getBookingInternal, {
      id: args.bookingId,
    });
    if (!booking) return;

    const isHidzama = booking.serviceCategory === "hidzama";
    const waterTip = isHidzama
      ? `<div style="background:#fdf5f2;border-radius:8px;padding:12px;margin:12px 0;font-size:13px;color:#843d2e;">
           Podsjetnik: Piti puno vode danas i izbjegavati tešku hranu prije termina.
         </div>`
      : "";

    const html = `
      ${emailHeader()}
      <h2 style="color:#4c5841;font-size:18px;margin:0 0 8px;">Podsjetnik: sutra termin</h2>
      <p style="color:#6f5f4b;font-size:14px;margin:0 0 12px;">
        Sutra imate zakazan termin — ne zaboravite!
      </p>
      ${bookingDetailsHtml({
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
      })}
      ${waterTip}
      <p style="color:#6f5f4b;font-size:13px;">Dođite 5 minuta ranije. Vidimo se sutra!</p>
      ${emailFooter()}`;

    await sendEmail({
      to: booking.clientEmail,
      subject: "Podsjetnik: sutra termin — ZenZone",
      html,
    });
  },
});

export const sendNewBookingAdmin = action({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.runQuery(internal.queries.bookings.getBookingInternal, {
      id: args.bookingId,
    });
    if (!booking) return;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not set. Skipping admin notification.");
      return;
    }

    const html = `
      ${emailHeader()}
      <h2 style="color:#4c5841;font-size:18px;margin:0 0 8px;">Novi termin</h2>
      <p style="color:#6f5f4b;font-size:14px;margin:0 0 12px;">
        Novi termin je zakazan i čeka potvrdu.
      </p>
      ${bookingDetailsHtml({
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        mood: booking.mood,
        clientName: booking.clientName,
      })}
      <div style="background:#f6f7f4;border-radius:8px;padding:12px;margin:12px 0;font-size:13px;color:#6f5f4b;">
        <p style="margin:0 0 4px;"><strong>Telefon:</strong> ${booking.clientPhone}</p>
        <p style="margin:0 0 4px;"><strong>Email:</strong> ${booking.clientEmail}</p>
        <p style="margin:0;"><strong>Referral:</strong> ${booking.referralSource || "Nije navedeno"}</p>
      </div>
      <a href="https://zenzone.vercel.app/admin" style="display:inline-block;background:#607050;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:500;">
        Pregledaj u admin panelu
      </a>
      ${emailFooter()}`;

    await sendEmail({
      to: adminEmail,
      subject: "Novi termin — ZenZone",
      html,
    });
  },
});

export const sendDailyReminders = action({
  args: {},
  handler: async (ctx) => {
    if (getHourInTimeZone(new Date(), APP_TIME_ZONE) !== 8) {
      return;
    }

    const tomorrow = getTomorrowString();
    type Booking = FunctionReturnType<typeof internal.queries.bookings.getBookingsByDateInternal>[number];
    const bookings: FunctionReturnType<typeof internal.queries.bookings.getBookingsByDateInternal> = await ctx.runQuery(internal.queries.bookings.getBookingsByDateInternal, {
      date: tomorrow,
    });

    const confirmed = bookings.filter((b: Booking) => b.status === "potvrđen");

    for (const booking of confirmed) {
      await ctx.runAction(api.actions.emails.sendDailyReminder, {
        bookingId: booking._id,
      });
    }
  },
});
