import { internalQuery, query, type QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { requireAdminSession } from "../lib/adminAuth";
import type { Doc, Id } from "../_generated/dataModel";

type BookingWithService = Doc<"bookings"> & {
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  serviceCategory: string;
};

async function withServiceData(ctx: QueryCtx, bookings: Doc<"bookings">[]): Promise<BookingWithService[]> {
  const result: BookingWithService[] = [];
  for (const booking of bookings) {
    const service = await ctx.db.get(booking.serviceId);
    result.push({
      ...booking,
      serviceName: service?.name ?? "",
      servicePrice: service?.price ?? 0,
      serviceDuration: service?.duration ?? "",
      serviceCategory: service?.category ?? "",
    });
  }
  return result;
}

async function getBookingsByDateCore(ctx: QueryCtx, date: string) {
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_date_time", (q) => q.eq("date", date))
    .collect();

  return await withServiceData(ctx, bookings);
}

async function getBookingCore(ctx: QueryCtx, id: Id<"bookings">): Promise<BookingWithService | null> {
  const booking = await ctx.db.get(id);
  if (!booking) {
    return null;
  }

  const [fullBooking] = await withServiceData(ctx, [booking]);
  return fullBooking;
}

export const getBookings = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    let bookings;
    if (args.status) {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      bookings = await ctx.db.query("bookings").collect();
    }

    return await withServiceData(ctx, bookings);
  },
});

export const getBookingsByDate = query({
  args: {
    date: v.string(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);
    return await getBookingsByDateCore(ctx, args.date);
  },
});

export const getBooking = query({
  args: {
    id: v.id("bookings"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);
    return await getBookingCore(ctx, args.id);
  },
});

export const getBookingsByDateInternal = internalQuery({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await getBookingsByDateCore(ctx, args.date);
  },
});

export const getBookingInternal = internalQuery({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await getBookingCore(ctx, args.id);
  },
});
