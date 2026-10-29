"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaKomponen } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import { namaSudahAda, tambahKomponen } from "@/app/data/mock-products";
import type { StatusForm } from "@/lib/status-form";

export async function simpanKomponen(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  // 1. Pemeriksaan sesi
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    nama: String(mentah.nama ?? ""),
    kategori: String(mentah.kategori ?? ""),
    harga: String(mentah.harga ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  // 2. Validasi bentuk dengan Zod 4
  const hasil = skemaKomponen.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  // 3. Validasi semantik (keunikan nama komponen)
  if (namaSudahAda(hasil.data.nama)) {
    return {
      galat: { nama: ["Nama komponen sudah dipakai produk lain"] },
      nilai,
    };
  }

  // 4. Mutasi penyimpanan data
  let id: string;
  try {
    id = tambahKomponen(hasil.data).id;
  } catch (e) {
    console.error("simpanKomponen gagal:", e);
    return { pesan: "Komponen gagal disimpan. Coba lagi.", nilai };
  }

  // 5. Revalidasi cache dan redirect (di luar blok try)
  revalidatePath("/shop");
  redirect(`/shop/${id}`);
}

