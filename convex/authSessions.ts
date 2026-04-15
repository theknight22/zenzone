import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const createSession = internalMutation({
  args: {
    tokenHash: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminSessions", {
      tokenHash: args.tokenHash,
      createdAt: args.createdAt,
      expiresAt: args.expiresAt,
    });
  },
});

export const getSessionByTokenHash = internalQuery({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .first();
  },
});

export const revokeSessionByTokenHash = internalMutation({
  args: {
    tokenHash: v.string(),
    revokedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .first();

    if (!session) {
      return;
    }

    await ctx.db.patch(session._id, { revokedAt: args.revokedAt });
  },
});
