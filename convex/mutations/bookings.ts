import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { getHourInTimeZone, getTodayString, isSlotAvailable } from "../lib/slots";
import { requireAdminSession } from "../lib/adminAuth";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const createBooking = mutation({
  args: {
    serviceId: v.id("services"),
    date: v.string(),
    time: v.string(),
    mood: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    medicalChecks: v.object({
      noBloodThinners: v.boolean(),
      noAnemia: v.boolean(),
      notPregnant: v.boolean(),
      noRecentFood: v.boolean(),
    }),
    referralSource: v.string(),
  },
  handler: async (ctx, args) => {
    const clientName = args.clientName.trim();
    const clientEmail = args.clientEmail.trim().toLowerCase();
    const clientPhone = args.clientPhone.trim();
    const referralSource = args.referralSource.trim();

    if (!clientName || !clientEmail || !clientPhone) {
      throw new Error("Ime, email i telefon su obavezni.");
    }

    if (!isValidEmail(clientEmail)) {
      throw new Error("Unesite ispravnu email adresu.");
    }

    if (args.date < getTodayString()) {
      throw new Error("Nije moguće zakazati termin u prošlosti.");
    }

    if (
      args.date === getTodayString() &&
      parseInt(args.time.split(":")[0], 10) <= getHourInTimeZone()
    ) {
      throw new Error("Nije moguće zakazati termin koji je već prošao danas.");
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service || !service.active) {
      throw new Error("Odabrana usluga više nije dostupna.");
    }

    const availability = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date_time", (q) =>
        q.eq("date", args.date)
      )
      .collect();

    const shift = availability?.shift ?? "";
    if (!isSlotAvailable(shift, bookings, args.time)) {
      throw new Error("Odabrani termin više nije dostupan.");
    }

    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      clientName,
      clientEmail,
      clientPhone,
      referralSource,
      status: "čekanje",
    });

    await ctx.runMutation(api.mutations.loyalty.incrementVisit, {
      phone: clientPhone,
    });

    await ctx.scheduler.runAfter(0, api.actions.emails.sendBookingReceived, {
      bookingId,
    });
    await ctx.scheduler.runAfter(0, api.actions.emails.sendNewBookingAdmin, {
      bookingId,
    });

    return bookingId;
  },
});

export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    if (args.status !== "potvrđen" && args.status !== "otkazan") {
      throw new Error("Status mora biti 'potvrđen' ili 'otkazan'.");
    }

    await ctx.db.patch(args.id, { status: args.status });

    if (args.status === "potvrđen") {
      await ctx.scheduler.runAfter(0, api.actions.emails.sendBookingConfirmed, {
        bookingId: args.id,
      });
    } else if (args.status === "otkazan") {
      await ctx.scheduler.runAfter(0, api.actions.emails.sendBookingCancelled, {
        bookingId: args.id,
      });
    }
  },
});

export const createAdminBooking = mutation({
  args: {
    clientName: v.string(),
    date: v.string(),
    time: v.string(),
    serviceId: v.id("services"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    const clientName = args.clientName.trim();
    if (!clientName) {
      throw new Error("Ime je obavezno.");
    }

    const service = await ctx.db.get(args.serviceId);
    if (!service || !service.active) {
      throw new Error("Odabrana usluga više nije dostupna.");
    }

    const availability = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date_time", (q) => q.eq("date", args.date))
      .collect();

    const shift = availability?.shift ?? "";
    if (!isSlotAvailable(shift, bookings, args.time)) {
      throw new Error("Odabrani termin više nije dostupan.");
    }

    const bookingId = await ctx.db.insert("bookings", {
      serviceId: args.serviceId,
      date: args.date,
      time: args.time,
      mood: "razgovor",
      clientName,
      clientEmail: "",
      clientPhone: "",
      status: "potvrđen",
      medicalChecks: {
        noBloodThinners: false,
        noAnemia: false,
        notPregnant: false,
        noRecentFood: false,
      },
      referralSource: "telefon",
    });

    return bookingId;
  },
});

export const cancelBooking = mutation({
  args: {
    id: v.id("bookings"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.mutations.bookings.updateBookingStatus, {
      id: args.id,
      status: "otkazan",
      sessionToken: args.sessionToken,
    });
  },
});
