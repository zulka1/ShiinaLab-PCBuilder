"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaKomponen } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import { inferProductAttributes } from "@/app/data/mock-products";
import type { StatusForm } from "@/lib/status-form";

export async function simpanKomponen(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Sesi berakhir. Silakan masuk kembali." };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
    gambar: String(mentah.gambar ?? ""),
  };

  const tersediaRaw = formData.get("tersedia");
  const tersedia =
    tersediaRaw === "on" || tersediaRaw === "true" || tersediaRaw === "1";

  const hasil = skemaKomponen.safeParse({
    ...mentah,
    tersedia,
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  const gambarInput = hasil.data.gambar?.trim() || null;
  const inferred = inferProductAttributes(
    hasil.data.nama,
    hasil.data.kategori,
    gambarInput,
  );

  let itemBaru: { id: number };
  try {
    itemBaru = await prisma.komponen.create({
      data: {
        nama: hasil.data.nama,
        kategori: hasil.data.kategori,
        harga: hasil.data.harga,
        deskripsi: hasil.data.deskripsi,
        tersedia: hasil.data.tersedia,
        gambar: gambarInput || inferred.image,
      },
      select: { id: true },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        galat: { nama: ["Nama komponen sudah terdaftar di katalog"] },
        pesan: "Komponen dengan nama yang sama sudah ada.",
        nilai,
      };
    }
    console.error("simpanKomponen error:", e);
    return {
      pesan: "Gagal menyimpan ke basis data. Coba beberapa saat lagi.",
      nilai,
    };
  }

  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect(`/shop/${itemBaru.id}`);
}

export async function ubahKomponen(
  id: number,
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  if (!(await bacaSesi())) {
    return { pesan: "Sesi berakhir. Silakan masuk kembali." };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
    gambar: String(mentah.gambar ?? ""),
  };

  const tersediaRaw = formData.get("tersedia");
  const tersedia =
    tersediaRaw === "on" || tersediaRaw === "true" || tersediaRaw === "1";

  const hasil = skemaKomponen.safeParse({
    ...mentah,
    tersedia,
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  const gambarInput = hasil.data.gambar?.trim() || null;
  const inferred = inferProductAttributes(
    hasil.data.nama,
    hasil.data.kategori,
    gambarInput,
  );

  try {
    await prisma.komponen.update({
      where: { id },
      data: {
        nama: hasil.data.nama,
        kategori: hasil.data.kategori,
        harga: hasil.data.harga,
        deskripsi: hasil.data.deskripsi,
        tersedia: hasil.data.tersedia,
        gambar: gambarInput || inferred.image,
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
  revalidatePath("/admin");
  redirect(`/shop/${id}`);
}

export async function hapusKomponen(id: number) {
  // Transaksi atomik (Modul 6): hapus ulasan terkait terlebih dahulu, baru hapus komponen
  await prisma.$transaction([
    prisma.ulasan.deleteMany({ where: { komponenId: id } }),
    prisma.komponen.delete({ where: { id } }),
  ]);

  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/shop");
}
