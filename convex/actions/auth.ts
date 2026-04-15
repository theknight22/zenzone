/// <reference types="node" />

"use node";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aDigest = createHash("sha256").update(a).digest();
  const bDigest = createHash("sha256").update(b).digest();
  return timingSafeEqual(aDigest, bDigest);
}

export const createAdminSession = action({
  args: { password: v.string() },
  handler: async (ctx, args): Promise<{ success: false } | { success: true; sessionToken: string; expiresAt: number }> => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not set.");
      return { success: false };
    }

    if (!safeEqual(args.password, adminPassword)) {
      return { success: false };
    }

    const sessionToken = randomBytes(32).toString("hex");
    const tokenHash = hashSessionToken(sessionToken);
    const createdAt = Date.now();
    const expiresAt = createdAt + ADMIN_SESSION_TTL_MS;

    await ctx.runMutation(internal.authSessions.createSession, {
      tokenHash,
      createdAt,
      expiresAt,
    });

    return {
      success: true,
      sessionToken,
      expiresAt,
    };
  },
});

export const verifyAdminSession = action({
  args: { sessionToken: v.string() },
  handler: async (ctx, args): Promise<{ valid: false } | { valid: true; expiresAt: number }> => {
    const tokenHash = hashSessionToken(args.sessionToken);
    const session: Doc<"adminSessions"> | null = await ctx.runQuery(
      internal.authSessions.getSessionByTokenHash,
      { tokenHash },
    );
    const now = Date.now();

    if (!session || session.revokedAt !== undefined || session.expiresAt <= now) {
      return { valid: false };
    }

    return {
      valid: true,
      expiresAt: session.expiresAt,
    };
  },
});

export const logoutAdminSession = action({
  args: { sessionToken: v.string() },
  handler: async (ctx, args): Promise<{ success: true }> => {
    const tokenHash = hashSessionToken(args.sessionToken);
    await ctx.runMutation(internal.authSessions.revokeSessionByTokenHash, {
      tokenHash,
      revokedAt: Date.now(),
    });

    return { success: true };
  },
});
