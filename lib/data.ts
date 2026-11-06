import "server-only";
import { prisma } from "@/lib/prisma";

const kolomKomponen = {
  id: true,
  nama: true,
  kategori: true,
  harga: true,
  deskripsi: true,
  tersedia: true,
  gambar: true,
  dibuatPada: true,
} as const;

export async function ambilDaftarKomponen() {
  return prisma.komponen.findMany({
    select: kolomKomponen,
    orderBy: { dibuatPada: "desc" },
  });
}

export async function ambilDetailKomponen(id: number) {
  return prisma.komponen.findUnique({
    where: { id },
    select: {
      ...kolomKomponen,
      ulasan: {
        select: {
          id: true,
          nama: true,
          nilai: true,
          komentar: true,
          dibuatPada: true,
        },
        orderBy: { dibuatPada: "desc" },
      },
    },
  });
}
