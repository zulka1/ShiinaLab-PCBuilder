"use server";

import argon2 from "argon2";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaDaftar, skemaMasuk } from "@/lib/skema";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const hasil = skemaMasuk.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir masuk.",
      nilai: { email: String(mentah.email ?? "") },
    };
  }

  const { email: identitas, kataSandi } = hasil.data;

  let pengguna = await prisma.pengguna.findFirst({
    where: {
      OR: [
        { email: { equals: identitas, mode: "insensitive" } },
        { username: { equals: identitas, mode: "insensitive" } },
      ],
    },
  });

  // Kompatibilitas penuh Modul 5 (.env.local DEMO_EMAIL / DEMO_KATA_SANDI)
  if (
    !pengguna &&
    process.env.DEMO_EMAIL &&
    process.env.DEMO_KATA_SANDI &&
    identitas.toLowerCase() === process.env.DEMO_EMAIL.toLowerCase() &&
    kataSandi === process.env.DEMO_KATA_SANDI
  ) {
    const hash = await argon2.hash(kataSandi, { type: argon2.argon2id });
    pengguna = await prisma.pengguna.upsert({
      where: { email: process.env.DEMO_EMAIL },
      update: { peran: "admin", passwordHash: hash },
      create: {
        username: "pengelola",
        email: process.env.DEMO_EMAIL,
        namaLengkap: "Pengelola Katalog ShiinaLab",
        passwordHash: hash,
        peran: "admin",
      },
    });
  }

  if (!pengguna) {
    return {
      pesan: "Email/username atau kata sandi salah.",
      nilai: { email: identitas },
    };
  }

  const cocok = await argon2.verify(pengguna.passwordHash, kataSandi);
  if (!cocok) {
    return {
      pesan: "Email/username atau kata sandi salah.",
      nilai: { email: identitas },
    };
  }

  const sesi = await buatSesi(pengguna.id);
  const tujuan = String(mentah.tujuan ?? "");
  if (tujuan.startsWith("/") && !tujuan.startsWith("//")) {
    redirect(tujuan);
  }

  if (sesi?.peran === "admin") {
    redirect("/admin");
  }

  redirect("/account");
}

export async function daftar(
  _sebelumnya: StatusForm,
  formData: FormData,
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const nilai = {
    username: String(mentah.username ?? ""),
    email: String(mentah.email ?? ""),
    namaLengkap: String(mentah.namaLengkap ?? ""),
  };

  const hasil = skemaDaftar.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali data pendaftaran Anda.",
      nilai,
    };
  }

  const { username, email, namaLengkap, kataSandi } = hasil.data;

  try {
    const passwordHash = await argon2.hash(kataSandi, {
      type: argon2.argon2id,
    });

    const penggunaBaru = await prisma.pengguna.create({
      data: {
        username,
        email,
        namaLengkap,
        passwordHash,
        peran: "user",
      },
    });

    await buatSesi(penggunaBaru.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        pesan: "Username atau email sudah terdaftar pada akun lain.",
        nilai,
      };
    }
    return {
      pesan: "Gagal membuat akun. Silakan coba lagi.",
      nilai,
    };
  }

  redirect("/account");
}

export async function keluar() {
  await hapusSesi();
  redirect("/");
}
