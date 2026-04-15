import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdminSession } from "../lib/adminAuth";
import {
  getAvailableSlotsForDay,
  getHourInTimeZone,
  getTodayString,
  getWeekDateStrings,
} from "../lib/slots";

export const getWeekAvailability = query({
  args: {
    offset: v.number(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    const dates = getWeekDateStrings(args.offset);
    const result = [];

    for (const date of dates) {
      const record = await ctx.db
        .query("availability")
        .withIndex("by_date", (q) => q.eq("date", date))
        .first();
      result.push({
        date,
        shift: record?.shift ?? "",
      });
    }
    return result;
  },
});

export const getAvailableSlots = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const shift = record?.shift ?? "";
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date_time", (q) => q.eq("date", args.date))
      .collect();

    const slots = getAvailableSlotsForDay(shift, bookings);
    if (args.date !== getTodayString()) {
      return slots;
    }

    const currentHour = getHourInTimeZone();
    return slots.map((slot) => ({
      time: slot.time,
      available: slot.available && parseInt(slot.time.split(":")[0], 10) > currentHour,
    }));
  },
});
