"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaKomponen } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

export async function simpanKomponen(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  // 1. Validasi Zod 4
  const hasil = skemaKomponen.safeParse({
    ...mentah,
    tersedia: formData.get("tersedia") === "on",
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  // 2. Simpan ke PostgreSQL melalui Prisma
  let baruId: number;
  try {
    const baru = await prisma.komponen.create({
      data: {
        nama: hasil.data.nama,
        kategori: hasil.data.kategori,
        harga: hasil.data.harga,
        deskripsi: hasil.data.deskripsi,
        tersedia: hasil.data.tersedia,
        gambar: hasil.data.gambar ?? null,
      },
    });
    baruId = baru.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        galat: { nama: ["Nama komponen sudah terdaftar"] },
        pesan: "Gagal menyimpan: nama komponen sudah ada.",
        nilai,
      };
    }
    console.error("simpanKomponen gagal:", e);
    return { pesan: "Komponen gagal disimpan ke basis data.", nilai };
  }

  // 3. Revalidasi cache dan redirect ke halaman detail
  revalidatePath("/shop");
  redirect(`/shop/${baruId}`);
}

export async function ubahKomponen(
  id: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  const hasil = skemaKomponen.safeParse({
    ...mentah,
    tersedia: formData.get("tersedia") === "on",
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  try {
    await prisma.komponen.update({
      where: { id },
      data: {
        nama: hasil.data.nama,
        kategori: hasil.data.kategori,
        harga: hasil.data.harga,
        deskripsi: hasil.data.deskripsi,
        tersedia: hasil.data.tersedia,
        gambar: hasil.data.gambar ?? null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          galat: { nama: ["Nama komponen sudah terdaftar"] },
          pesan: "Nama komponen sudah dipakai produk lain.",
          nilai,
        };
      }
      if (e.code === "P2025") {
        return { pesan: "Komponen tidak ditemukan atau sudah dihapus." };
      }
    }
    throw e;
  }

  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);
  return { pesan: "Perubahan disimpan." };
}

export async function hapusKomponen(id: number) {
  // Transaksi atomik: hapus ulasan terkait terlebih dahulu, baru hapus komponen
  await prisma.$transaction([
    prisma.ulasan.deleteMany({ where: { komponenId: id } }),
    prisma.komponen.delete({ where: { id } }),
  ]);

  revalidatePath("/shop");
  redirect("/shop");
}
