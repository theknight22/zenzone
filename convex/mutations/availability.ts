import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { formatDate } from "../lib/slots";
import { requireAdminSession } from "../lib/adminAuth";

export const setShift = mutation({
  args: {
    date: v.string(),
    shift: v.string(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { shift: args.shift, blockedSlots: existing.blockedSlots ?? [] });
    } else {
      await ctx.db.insert("availability", {
        date: args.date,
        shift: args.shift,
        blockedSlots: [],
      });
    }
  },
});

export const setWeekShifts = mutation({
  args: {
    offset: v.number(),
    shifts: v.array(v.string()),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    if (args.shifts.length !== 7) {
      throw new Error("Potrebno je tačno 7 smjena za sedmicu.");
    }

    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + args.offset * 7);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDate(d);

      const existing = await ctx.db
        .query("availability")
        .withIndex("by_date", (q) => q.eq("date", dateStr))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { shift: args.shifts[i] });
      } else {
        await ctx.db.insert("availability", {
          date: dateStr,
          shift: args.shifts[i],
          blockedSlots: [],
        });
      }
    }
  },
});

export const toggleBlockedSlot = mutation({
  args: {
    date: v.string(),
    time: v.string(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.sessionToken);

    const existing = await ctx.db
      .query("availability")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const blockedSlots = existing?.blockedSlots ?? [];
    const isBlocked = blockedSlots.includes(args.time);

    if (existing) {
      await ctx.db.patch(existing._id, {
        blockedSlots: isBlocked
          ? blockedSlots.filter((t) => t !== args.time)
          : [...blockedSlots, args.time],
      });
    } else {
      await ctx.db.insert("availability", {
        date: args.date,
        shift: "",
        blockedSlots: [args.time],
      });
    }
  },
});
