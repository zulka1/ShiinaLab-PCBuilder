"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaKomponen } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import { inferProductAttributes } from "@/app/data/mock-products";

export async function tambahKomponenAdmin(formData: FormData) {
  const sesi = await bacaSesi();
  if (!sesi || sesi.peran !== "admin") {
    return { error: "Akses ditolak. Hanya Super Admin yang dapat mengelola inventaris." };
  }

  const mentah = Object.fromEntries(formData);
  const tersediaRaw = formData.get("tersedia");
  const tersedia =
    tersediaRaw === "on" || tersediaRaw === "true" || tersediaRaw === null;

  const hasil = skemaKomponen.safeParse({
    ...mentah,
    tersedia,
  });

  if (!hasil.success) {
    const flat = z.flattenError(hasil.error).fieldErrors;
    const firstMsg = Object.values(flat).flat().find(Boolean);
    return { error: firstMsg || "Periksa kembali isian formulir komponen." };
  }

  const gambarInput = hasil.data.gambar?.trim() || null;
  const inferred = inferProductAttributes(
    hasil.data.nama,
    hasil.data.kategori,
    gambarInput,
  );

  try {
    const item = await prisma.komponen.create({
      data: {
        nama: hasil.data.nama,
        kategori: hasil.data.kategori,
        harga: hasil.data.harga,
        deskripsi: hasil.data.deskripsi,
        tersedia: hasil.data.tersedia,
        gambar: gambarInput || inferred.image,
      },
    });
    revalidatePath("/shop");
    revalidatePath("/admin");
    return { item };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Nama komponen sudah terdaftar di katalog." };
    }
    return { error: "Gagal menyimpan komponen ke PostgreSQL." };
  }
}

export async function editKomponenAdmin(
  formData: FormData,
): Promise<{ item?: unknown; error?: string }> {
  const sesi = await bacaSesi();
  if (!sesi || sesi.peran !== "admin") {
    return { error: "Akses ditolak: Hanya Super Admin yang dapat mengubah data komponen." };
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID komponen tidak valid." };
  }

  const mentah = Object.fromEntries(formData);
  const hasil = skemaKomponen.safeParse(mentah);

  if (!hasil.success) {
    const flat = z.flattenError(hasil.error).fieldErrors;
    const firstMsg = Object.values(flat).flat().find(Boolean);
    return { error: firstMsg || "Periksa kembali isian formulir komponen." };
  }

  const gambarInput = hasil.data.gambar?.trim() || null;
  const inferred = inferProductAttributes(
    hasil.data.nama,
    hasil.data.kategori,
    gambarInput,
  );

  try {
    const item = await prisma.komponen.update({
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

    revalidatePath("/shop");
    revalidatePath(`/shop/${id}`);
    revalidatePath("/admin");
    return { item };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Nama komponen sudah digunakan oleh komponen lain." };
    }
    return { error: "Gagal memperbarui data komponen di PostgreSQL." };
  }
}

export async function toggleStokKomponen(
  id: number,
  nextStatus: boolean,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const sesi = await bacaSesi();
    if (!sesi || sesi.peran !== "admin") {
      return { error: "Akses ditolak: Hanya Super Admin yang dapat mengubah status stok." };
    }

    await prisma.komponen.update({
      where: { id },
      data: { tersedia: nextStatus },
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui status stok komponen di basis data." };
  }
}

export async function hapusKomponenAdmin(
  id: number,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const sesi = await bacaSesi();
    if (!sesi || sesi.peran !== "admin") {
      return { error: "Akses ditolak: Hanya Super Admin yang dapat menghapus komponen." };
    }

    // MODUL 7 PERBAIKAN: Transaksi atomik agar ulasan terkait ikut terhapus bersama komponen
    await prisma.$transaction([
      prisma.ulasan.deleteMany({ where: { komponenId: id } }),
      prisma.komponen.delete({ where: { id } }),
    ]);

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("Gagal menghapus:", e);
    return { error: "Gagal menghapus komponen dari basis data." };
  }
}
