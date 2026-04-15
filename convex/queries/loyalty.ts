import { query } from "../_generated/server";
import { v } from "convex/values";

export const getLoyaltyByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("loyalty")
      .withIndex("by_phone", (q) => q.eq("clientPhone", args.phone))
      .first();
    return record ?? null;
  },
});
