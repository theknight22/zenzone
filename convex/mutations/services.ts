import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const addService = mutation({
  args: {
    name: v.string(),
    duration: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", { ...args, active: true });
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    duration: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const toggleService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.id);
    if (!service) throw new Error("Usluga nije pronađena.");
    await ctx.db.patch(args.id, { active: !service.active });
  },
});
