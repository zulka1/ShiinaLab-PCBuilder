import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const sessionCookieName = "shiina_session";

export type CurrentSession = {
  sessionId: number;
  userId: number;
};

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = db.prepare(`
    SELECT id AS sessionId, user_id AS userId
    FROM sessions
    WHERE token_hash = ? AND expires_at > ?
  `).get(tokenHash, new Date().toISOString()) as CurrentSession | undefined;

  return session ?? null;
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
