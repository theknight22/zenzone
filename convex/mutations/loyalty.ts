import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { formatDate } from "../lib/slots";

export const incrementVisit = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    // Normalize phone: strip spaces and dashes
    const phone = args.phone.replace(/[\s-]/g, "");
    const today = formatDate(new Date());

    const existing = await ctx.db
      .query("loyalty")
      .withIndex("by_phone", (q) => q.eq("clientPhone", phone))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        visitCount: existing.visitCount + 1,
        lastVisit: today,
      });
    } else {
      await ctx.db.insert("loyalty", {
        clientPhone: phone,
        visitCount: 1,
        lastVisit: today,
      });
    }
  },
});
