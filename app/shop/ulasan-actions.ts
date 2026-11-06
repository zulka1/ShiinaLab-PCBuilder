"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaUlasan } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

export async function tambahUlasan(
  komponenId: number,
  _prev: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const hasil = skemaUlasan.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir ulasan.",
    };
  }

  try {
    await prisma.ulasan.create({
      data: {
        komponenId,
        nama: hasil.data.nama,
        nilai: hasil.data.nilai,
        komentar: hasil.data.komentar,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          galat: { nama: ["Nama ini sudah mengulas komponen ini"] },
          pesan: "Anda sudah memberikan ulasan untuk komponen ini.",
        };
      }
      if (e.code === "P2003") {
        return { pesan: "Komponen tidak ditemukan." };
      }
    }
    console.error("tambahUlasan error:", e);
    return { pesan: "Gagal menyimpan ulasan. Coba lagi." };
  }

  revalidatePath(`/shop/${komponenId}`);
  return { pesan: "Ulasan berhasil tersimpan." };
}

export async function hapusUlasan(id: number, komponenId: number) {
  await prisma.ulasan.deleteMany({
    where: { id, komponenId },
  });
  revalidatePath(`/shop/${komponenId}`);
}
