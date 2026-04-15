import { internal } from "../_generated/api";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

type CtxWithRunQuery = Pick<ActionCtx, "runQuery"> | Pick<MutationCtx, "runQuery"> | Pick<QueryCtx, "runQuery">;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashSessionToken(sessionToken: string): Promise<string> {
  const data = new TextEncoder().encode(sessionToken);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

export async function requireAdminSession(ctx: CtxWithRunQuery, sessionToken: string): Promise<void> {
  const tokenHash = await hashSessionToken(sessionToken);
  const session = await ctx.runQuery(internal.authSessions.getSessionByTokenHash, { tokenHash });
  const now = Date.now();

  if (!session || session.revokedAt !== undefined || session.expiresAt <= now) {
    throw new Error("Unauthorized");
  }
}
