import "server-only";
import { bacaSesi, NAMA_COOKIE_SESI } from "@/lib/sesi";

export const sessionCookieName = NAMA_COOKIE_SESI;

export type CurrentSession = {
  sessionId: string;
  userId: number;
};

export type AuthenticatedUser = {
  id: number;
  username: string;
  fullName: string | null;
  email: string;
  role: string;
};

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const sesi = await bacaSesi();
  if (!sesi) return null;
  return {
    sessionId: sesi.id,
    userId: sesi.penggunaId,
  };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const sesi = await bacaSesi();
  if (!sesi) return null;
  return {
    id: sesi.penggunaId,
    username: sesi.username,
    fullName: sesi.namaLengkap,
    email: sesi.email,
    role: sesi.peran,
  };
}
