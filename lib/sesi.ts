import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type DataSesi = {
  id: string;
  penggunaId: number;
  username: string;
  email: string;
  namaLengkap: string | null;
  peran: string;
  kedaluwarsa: number;
};

export const NAMA_COOKIE_SESI = "sesi";
const DELAPAN_JAM = 60 * 60 * 8;

export async function buatSesi(identitas: number | string): Promise<DataSesi | null> {
  const pengguna =
    typeof identitas === "number"
      ? await prisma.pengguna.findUnique({ where: { id: identitas } })
      : await prisma.pengguna.findFirst({
          where: {
            OR: [
              { email: { equals: identitas, mode: "insensitive" } },
              { username: { equals: identitas, mode: "insensitive" } },
            ],
          },
        });

  if (!pengguna) return null;

  const id = crypto.randomUUID();
  const kedaluwarsaDate = new Date(Date.now() + DELAPAN_JAM * 1000);

  await prisma.sesiPengguna.create({
    data: {
      id,
      penggunaId: pengguna.id,
      kedaluwarsa: kedaluwarsaDate,
    },
  });

  (await cookies()).set(NAMA_COOKIE_SESI, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });

  return {
    id,
    penggunaId: pengguna.id,
    username: pengguna.username,
    email: pengguna.email,
    namaLengkap: pengguna.namaLengkap,
    peran: pengguna.peran,
    kedaluwarsa: kedaluwarsaDate.getTime(),
  };
}

export async function bacaSesi(): Promise<DataSesi | null> {
  const toko = await cookies();
  const id = toko.get(NAMA_COOKIE_SESI)?.value;
  if (!id) return null;

  try {
    const record = await prisma.sesiPengguna.findUnique({
      where: { id },
      include: { pengguna: true },
    });

    if (!record || record.kedaluwarsa.getTime() < Date.now()) {
      if (record) {
        await prisma.sesiPengguna.delete({ where: { id } }).catch(() => {});
      }
      return null;
    }

    return {
      id: record.id,
      penggunaId: record.pengguna.id,
      username: record.pengguna.username,
      email: record.pengguna.email,
      namaLengkap: record.pengguna.namaLengkap,
      peran: record.pengguna.peran,
      kedaluwarsa: record.kedaluwarsa.getTime(),
    };
  } catch {
    return null;
  }
}

export async function hapusSesi() {
  const toko = await cookies();
  const id = toko.get(NAMA_COOKIE_SESI)?.value;
  if (id) {
    await prisma.sesiPengguna.deleteMany({ where: { id } }).catch(() => {});
  }
  toko.delete(NAMA_COOKIE_SESI);
}
